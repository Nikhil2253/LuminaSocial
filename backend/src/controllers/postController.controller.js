import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Tag from "../models/tag.model.js";

export const createPost = async (req, res) => {
  try {
    const { username, description, visibility } = req.body;

    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const tags = (description.match(/#\w+/g) || []).map(tag =>
      tag.slice(1).toLowerCase()
    );

    for (const tag of tags) {
      const existingTag = await Tag.findOne({ value: tag });
      if (existingTag) {
        existingTag.count += 1;
        await existingTag.save();
      } else {
        await Tag.create({ value: tag, count: 1 });
      }
    }

    const cleanDescription = description.replace(/#\w+\s*/g, "").trim();

    const media = [];
    if (req.file) {
      const fileType = req.file.mimetype.startsWith("video") ? "video" : "image";
      media.push({
        url: `/uploads/${req.file.filename}`,
        type: fileType,
      });
    }

    const newPost = new Post({
      user: foundUser._id,
      description: cleanDescription,
      tags,
      media,
      visibility: visibility || "public",
    });

    const savedPost = await newPost.save();

    foundUser.posts.push(savedPost._id);
    await foundUser.save();

    res.status(201).json({
      message: "Post posted successfully",
      savedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ message: "User or Post not found" });

    const alreadyLiked = post.likes.some(id => id.toString() === user._id.toString());
    if (alreadyLiked) return res.status(400).json({ message: "Already liked" });

    post.likes.push(user);
    user.likedPosts.push(post);

    await post.save();
    await user.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ message: "User or Post not found" });

    post.likes = post.likes.filter(id => id.toString() !== user._id.toString());
    user.likedPosts = user.likedPosts.filter(id => id.toString() !== post._id.toString());

    await post.save();
    await user.save();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isPostLiked = async (req, res) => {
  try {
    const { userId, postId } = req.query;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isLiked = user.likedPosts.some(id => id.toString() === postId);

    res.status(200).json({ isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const bookMark = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ message: "User or Post not found" });

    const alreadyBookmarked = user.bookMarks.some(id => id.toString() === post._id.toString());
    if (alreadyBookmarked) return res.status(400).json({ message: "Already bookmarked" });

    user.bookMarks.push(post._id);
    await user.save();

    res.status(200).json({ message: "Post bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unbookMark = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ message: "User or Post not found" });

    user.bookMarks = user.bookMarks.filter(id => id.toString() !== post._id.toString());
    await user.save();

    res.status(200).json({ message: "Post unbookmarked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isbookMark = async (req, res) => {
  try {
    const { userId, postId } = req.query;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isBookmarked = user.bookMarks.some(id => id.toString() === postId);

    res.status(200).json({ isBookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postComment = async (req, res) => {
  try {
    const { userId, postId, text } = req.body;

    if (!userId || !postId || !text) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      text: text,
      createdAt: new Date(),
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('user', 'username profilePic profilename')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username profilePic profilename',
        },
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post fetched', data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookMarks = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is Required" });
    }

    const user = await User.findById(id)
      .populate({
        path: "bookMarks",
        populate: {
          path: "user",
          select: "profilePic profilename username",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ bookMarks: user.bookMarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getFeed = async (req, res) => {
  try {
    const randomPosts = await Post.aggregate([
      { $match: { visibility: "public" } },
      { $sample: { size: 30 } }
    ]);

    const populatedPosts = await Post.populate(randomPosts, {
      path: "user",
      select: "username profilename profilePic"
    });

    res.status(200).json(populatedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Post ID is required" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    for (const tag of post.tags) {
      const existingTag = await Tag.findOne({ value: tag });
      if (existingTag) {
        existingTag.count = Math.max(0, existingTag.count - 1);
        await existingTag.save();
      }
    }

    await Post.deleteOne({ _id: id });
    await User.updateOne({ _id: post.user }, { $pull: { posts: id } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id, description } = req.body;
    if (!id || !description) return res.status(400).json({ message: "ID and description are required" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newTags = (description.match(/#\w+/g) || []).map(tag => tag.slice(1).toLowerCase());
    const cleanDescription = description.replace(/#\w+\s*/g, "").trim();

    const oldTags = post.tags || [];

    post.description = cleanDescription;
    post.tags = newTags;
    post.isEdited = true;
    await post.save();

    const removedTags = oldTags.filter(tag => !newTags.includes(tag));
    const addedTags = newTags.filter(tag => !oldTags.includes(tag));

    for (const tag of removedTags) {
      const updatedTag = await Tag.findOneAndUpdate(
        { value: tag },
        { $inc: { count: -1 } },
        { new: true }
      );
      if (updatedTag && updatedTag.count <= 0) {
        await Tag.deleteOne({ value: tag });
      }
    }

    for (const tag of addedTags) {
      const existingTag = await Tag.findOne({ value: tag });
      if (existingTag) {
        existingTag.count += 1;
        await existingTag.save();
      } else {
        await Tag.create({ value: tag, count: 1 });
      }
    }

    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const posts = await Post.find({
      visibility: "public",
      tags: tag
    }).populate("user", "username profilename profilePic");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
