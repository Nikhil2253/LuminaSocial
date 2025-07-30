import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilename = req.body.profilename || user.profilename;
    user.bio = req.body.bio || user.bio;
    user.profilePic = req.body.profilePic || user.profilePic;
    user.coverPhoto = req.body.coverPhoto || user.coverPhoto;
    user.gender = req.body.gender || user.gender;
    user.dob = req.body.dob || user.dob;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        profilename: updatedUser.profilename,
        bio: updatedUser.bio,
        coverPhoto: updatedUser.coverPhoto,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("profilename profilePic bio email dob gender");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { profilename, bio, email, dob, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        profilename,
        bio,
        email,
        dob,
        gender,
      },
      { new: true }
    ).select("profilename bio email dob gender");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

export const viewUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username })
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "user",
          select: "username profilePic profilename",
        },
      })
      .populate({
        path: "likedPosts",
        populate: {
          path: "user",
          select: "username profilePic profilename",
        },
      })
      .populate({
        path: "bookMarks",
        populate: {
          path: "user",
          select: "username profilePic profilename",
        },
      })
      .populate("followers", "username profilePic profilename")
      .populate("following", "username profilePic profilename");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in viewUser:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId } = req.body;
    if (!followerId || !id) {
      return res.status(400).json({ message: "Missing Required Field" });
    }

    const follower = await User.findById(followerId);
    const following = await User.findById(id);

    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!follower.following.includes(id)) {
      follower.following.push(id);
    }

    if (!following.followers.includes(followerId)) {
      following.followers.push(followerId);
    }

    await follower.save();
    await following.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId } = req.body;
    if (!followerId || !id) {
      return res.status(400).json({ message: "Missing Required Field" });
    }

    const follower = await User.findById(followerId);
    const following = await User.findById(id);

    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    follower.following = follower.following.filter(uid => uid.toString() !== id);
    following.followers = following.followers.filter(uid => uid.toString() !== followerId);

    await follower.save();
    await following.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await User.find({}, "username profilename profilePic");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    await Post.deleteMany({ user: user._id });
    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: "Account and all related posts deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};