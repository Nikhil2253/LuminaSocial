import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: [
    {
      url: String,
      type: {
        type: String,
        enum: ["image", "video"],
        default: "image",
      },
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }
  ],
  tags: [String],
  isEdited: {
    type: Boolean,
    default: false,
  },
  visibility: {
    type: String,
    enum: ["public", "private", "friends"],
    default: "public",
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
