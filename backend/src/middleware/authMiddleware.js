import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "user",
          select: "username profilePic profilename"
        }
      })
      .populate({
        path: "likedPosts",
        populate: {
          path: "user",
          select: "username profilePic profilename"
        }
      })
      .populate({
        path: "bookMarks",
        populate: {
          path: "user",
          select: "username profilePic profilename"
        }
      })
      .populate("followers", "username profilePic")
      .populate("following", "username profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
