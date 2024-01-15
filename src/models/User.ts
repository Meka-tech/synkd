import mongoose, { model, Schema, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true,
    default: "Available"
  },
  password: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  serachPreferences: {
    type: String,
    enum: ["proximity", "worldwide"],
    default: "proximity"
  },
  premium: {
    type: Boolean,
    required: true,
    default: false
  },
  interests: {
    music: [String]
  },
  friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  notifications: {
    receivedRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        matchCategory: String,
        percent: String,
        createdAt: { type: Date, default: Date.now },
        notificationType: { type: String, default: "receivedRequest" }
      }
    ],
    sentRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        createdAt: { type: Date, default: Date.now },
        notificationType: { type: String, default: "sentRequest" }
      }
    ]
  }
});

UserSchema.index({ location: "2dsphere" });

const User = models.user || model("user", UserSchema);

export default User;
