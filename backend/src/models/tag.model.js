import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;