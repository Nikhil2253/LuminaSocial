import React, { useEffect, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useMessage } from "../contexts/MessageContext";
import axios from "axios";

const Chatters = () => {
  const { sender, setReceiver, allMessangers } = useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [chatters, setChatters] = useState([]);

  useEffect(() => {
    const fetchChatters = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/message/allChats/now/${sender.username}`
        );
        setChatters(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (sender?._id) fetchChatters();
  }, [sender]);

  useEffect(()=>{
    console.log(chatters)
  },[chatters]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const matches = allMessangers.filter(
        (user) =>
          user.profilename?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(matches);
      console.log(filtered)
    } else {
      setFiltered([]);
    }
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setReceiver(user);
    setSearchTerm("");
    setFiltered([]);
  };

  const handleSelectChatter = (chat) => {
    setReceiver(chat.receiverId);
  };

  return (
    <div className="bg-white w-[30%] h-full overflow-y-scroll border-r border-gray-200">
      <div className="sticky top-0 bg-white z-10 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md outline-none"
          />
        </div>
        {filtered.length > 0 && (
          <div className="bg-white mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto shadow-lg">
            {filtered.map((user) => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
              >
                {user.profilePic ? (
                  <img
                    src={`http://localhost:4000${user.profilePic}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-yellow-400" />
                )}
                <div>
                  <div className="font-medium">{user.profilename}</div>
                  <div className="text-sm text-gray-400">@{user.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2">
        {
          chatters.map((chat) => {
            const user = chat.receiverId;
            return (
              <div
                key={user._id}
                onClick={() => handleSelectChatter(chat)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
              >
                {user.profilePic ? (
                  <img
                    src={`http://localhost:4000${user.profilePic}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-yellow-400" />
                )}
                <div>
                  <div className="font-medium">{user.profilename}</div>
                  <div className="text-sm text-gray-400">@{user.username}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Chatters;
