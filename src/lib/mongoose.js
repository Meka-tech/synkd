import mongoose from "mongoose";

export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(
      "mongodb+srv://Nnaemeka:NnaemekaOnyeji12@cluster.0sipq0j.mongodb.net/"
    );
  }
}
