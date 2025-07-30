import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


chatSchema.index(
  { user1: 1, user2: 1 },
  { unique: true }
);


chatSchema.pre("validate", function (next) {
  if (this.user1.toString() > this.user2.toString()) {
    const temp = this.user1;
    this.user1 = this.user2;
    this.user2 = temp;
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
