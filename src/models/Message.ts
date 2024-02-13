import mongoose, { model, Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    room: String,
    text: String,
    readStatus: { type: Boolean, default: false },
    uuid: String
  },
  {
    timestamps: true
  }
);

MessageSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 86400, partialFilterExpression: { readStatus: true } }
);

const Message = models.message || model("message", MessageSchema);

export default Message;
