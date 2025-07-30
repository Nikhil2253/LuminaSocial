import { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [allMessangers, setAllMessangers] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000");
    if (user) {
      socket.current.emit("addUser", user.id);
    }
    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket.current) return;

   const handleIncoming = (data) => {
  if (data.senderId === sender?._id) return;

  const incoming = {
    id: Date.now(),
    senderId: data.senderId,
    receiverId: data.receiverId,
    text: data.text,
    timestamp: new Date().toISOString(),
  };

  if (
    (receiver && data.senderId === receiver._id) ||
    (sender && data.senderId === receiver._id)
  ) {
    setMessages((prev) => [...prev, incoming]);
  }

  console.log("Received via socket:", incoming);
};


    socket.current.on("getMessage", handleIncoming);

    return () => {
      socket.current.off("getMessage", handleIncoming);
    };
  }, [receiver, sender]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !sender || !receiver) return;
    const newMessage = {
      senderId: sender._id,
      receiverId: receiver._id,
      text: messageInput,
      timestamp: new Date().toISOString(),
    };

    setMessageInput("");
    socket.current.emit("sendMessage", newMessage);
    setMessages((prev)=>[...prev,newMessage])
    try {
      await axios.post("http://localhost:4000/api/message/send-message", {
        sender: newMessage.senderId,
        receiver: newMessage.receiverId,
        text: newMessage.text,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    const fetchMessangerData = async () => {
      try {
        const senderRes = await axios.get(
          `http://localhost:4000/api/message/messanger/${user.id}`
        );
        setSender(senderRes.data.messanger);

        const allRes = await axios.get(
          `http://localhost:4000/api/message/allmessangers`
        );
        setAllMessangers(allRes.data.messangers);
      } catch (error) {
        console.log("Error loading messengers:", error);
      }
    };
    if (user?.id) fetchMessangerData();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!sender || !receiver) return;
      try {
        const res = await axios.get(
          `http://localhost:4000/api/message/${sender._id}/${receiver._id}`
        );
        setMessages(res.data.messages || []);
      } catch (error) {
        console.log("Error fetching chat:", error);
      }
    };
    fetchMessages();
  }, [sender, receiver]);

  return (
    <MessageContext.Provider
      value={{
        sender,
        setSender,
        receiver,
        setReceiver,
        messages,
        setMessages,
        messageInput,
        setMessageInput,
        sendMessage,
        allMessangers,
        setAllMessangers,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
