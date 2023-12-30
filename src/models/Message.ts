import mongoose, { model, Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    room: String,
    text: String
  },
  {
    timestamps: true
  }
);

const Message = models.message || model("message", MessageSchema);

export default Message;
