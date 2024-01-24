import { mongooseConnect } from "../../../../lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await mongooseConnect();
  const secret = process.env.JWT_SECRET;

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "No user with this email" });
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      secret,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({ token: token, user: user, message: "authenticated" });
  } catch (err) {
    res.status(500).json({ data: err });
  }
}
