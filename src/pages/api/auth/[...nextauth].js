import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";
import axios from "axios";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user: profile, account }) {
      if (account.provider === "google") {
        try {
          await mongooseConnect();

          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            const user = new User({
              email: profile.email,
              username: profile.name
            });
            await user.save();
            const access_token = jwt.sign(
              {
                email: user.email,
                userId: user._id.toString()
              },
              secret,
              { expiresIn: "24h" }
            );
            profile.accessToken = access_token;
          } else {
            const access_token = jwt.sign(
              {
                email: userExists.email,
                userId: userExists._id.toString()
              },
              secret,
              { expiresIn: "24h" }
            );
            profile.accessToken = access_token;
          }

          return true;
        } catch (e) {
          console.log("Error checking if user exists: ", error.message);
          return true;
        }
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token = { accessToken: user.accessToken };
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({}) {
      return "/preloaded";
    }
  }
};

export default NextAuth(authOptions);
