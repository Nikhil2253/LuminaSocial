import User from "../models/user.model.js";

export const uploadProfilePic = async (req, res) => {
  const { username } = req.body;

  if (!username || !req.file) {
    return res.status(400).json({ message: "Username and file are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: "Profile picture updated", profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile picture", error: err.message });
  }
};

export const uploadCoverPhoto = async (req, res) => {
  const { username } = req.body;

  if (!username || !req.file) {
    return res.status(400).json({ message: "Username and file are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.coverPhoto = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: "Cover photo updated", coverPhoto: user.coverPhoto });
  } catch (err) {
    res.status(500).json({ message: "Error updating cover photo", error: err.message });
  }
};
