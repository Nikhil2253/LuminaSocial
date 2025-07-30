import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

export const getMessanger = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "username profilename _id profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ messanger: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessangers = async (req, res) => {
  try {
    const users = await User.find().select(
      "username profilename _id profilePic"
    );
    res.status(200).json({ messangers: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { sender, receiver, text } = req.body;

  if (!sender || !receiver || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [user1, user2] =
      sender < receiver ? [sender, receiver] : [receiver, sender];

    let chat = await Chat.findOne({ user1, user2 });
    if (!chat) {
      chat = await Chat.create({ user1, user2 });
    }

    const newMessage = await Message.create({ sender, receiver, text });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

export const getMessages = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username profilePic")
      .populate("receiver", "username profilePic");

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages", error });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    const chats = await Chat.find({
      $or: [{ user1: user._id }, { user2: user._id }],
    })
      .populate("user1", "username profilePic profilename")
      .populate("user2", "username profilePic profilename")
      .sort({ updatedAt: -1 });

    const formattedChats = chats
      .map((chat) => {
        if (!chat.user1 || !chat.user2) return null;

        const isUser1 = chat.user1._id.toString() === user._id.toString();
        const sender = isUser1 ? chat.user1 : chat.user2;
        const receiver = isUser1 ? chat.user2 : chat.user1;

        if (receiver._id.toString() === user._id.toString()) return null;

        return {
          _id: chat._id,
          senderId: {
            _id: sender._id,
            username: sender.username,
            profilePic: sender.profilePic,
            profilename: sender.profilename,
          },
          receiverId: {
            _id: receiver._id,
            username: receiver.username,
            profilePic: receiver.profilePic,
            profilename: receiver.profilename,
          },
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        };
      })
      .filter((c) => c !== null); 

    res.status(200).json(formattedChats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the chats", error });
  }
};

