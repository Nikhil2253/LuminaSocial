import React, { useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaPaperPlane,
  FaCommentDots,
  FaArrowLeft,
} from "react-icons/fa";
import { useMessage } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";

const Chats = () => {
  const {
    sender,
    receiver,
    setReceiver,
    messages,
    messageInput,
    setMessageInput,
    sendMessage,
  } = useMessage();
  const { user } = useAuth();
  const bottomRef = useRef();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!receiver) {
    return (
      <div className="bg-white w-[70%] h-full flex items-center justify-center text-center flex-col border-r-2 border-yellow-300">
        <FaCommentDots className="text-6xl text-yellow-400 mb-4" />
        <h2 className="text-xl font-semibold text-yellow-500">LuminaSocial</h2>
        <p className="text-gray-500 text-sm mt-2">
          Welcome to LuminaSocial Messenger{" "}
          <span className="text-xl text-orange-300 font-semibold">
            {sender?.profilename}
          </span>
        </p>
        <p className="text-gray-500 text-sm mt-1">
          No chat selected. Start a conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white w-[70%] h-full flex flex-col border-r-2 border-yellow-300 relative">
      <div className="flex items-center gap-3 p-4 border-b-2 border-yellow-300 sticky top-0 z-10 bg-white">
        <button
          onClick={() => setReceiver(null)}
          className="p-1 rounded hover:bg-yellow-100 text-black"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex items-center gap-3">
          {receiver.profilePic?.trim() ? (
            <img
              src={`http://localhost:4000${receiver.profilePic}`}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-3xl text-yellow-400" />
          )}
          <div>
            <div className="font-semibold text-black">
              {receiver.profilename || "User Name"}
            </div>
            <div className="text-sm text-gray-500">
              @{receiver.username || "username"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) &&
          messages.map((msg) => {
            const isMe = msg.senderId === sender?._id || msg.sender?.username === user.username;
            return (
              <div
                key={msg._id || msg.id}
                className={`max-w-[60%] break-words px-4 py-2 rounded-2xl text-sm shadow-md ${
                  isMe
                    ? "ml-auto bg-yellow-400 text-white rounded-br-none font-semibold"
                    : "mr-auto bg-white text-black rounded-bl-none font-semibold"
                }`}
              >
                {msg.text}
              </div>
            );
          })}
        <div ref={bottomRef}></div>
      </div>

      <div className="sticky bottom-0 border-t-2 border-yellow-300 p-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1 bg-white p-2 border-2 border-yellow-400 text-black font-semibold outline-none rounded-full"
        />
        <button
          onClick={sendMessage}
          className="bg-yellow-400 hover:bg-yellow-400 text-white py-3 px-5 rounded-md"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chats;
