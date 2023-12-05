import { model, Schema, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
  interests: {
    music: [String]
  }
});

UserSchema.index({ location: "2dsphere" });

const User = models.user || model("user", UserSchema);

export default User;
