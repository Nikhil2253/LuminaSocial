import Tag from "../models/tag.model.js";

export const fetchAllTags=async (req, res) => {
  try {
    const tags = await Tag.find({})
      .sort({ count: -1 })
      .limit(30);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}