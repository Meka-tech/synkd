import { mongooseConnect } from "../../../../lib/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  await mongooseConnect();

  const { email, password, username } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const existingName = await User.findOne({ username });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already taken. Please choose another.",
        input: "email"
      });
    }
    if (existingName) {
      return res.status(400).json({
        message: "Username is already taken.",
        input: "username"
      });
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPw,
      username
    });
    const newUser = await user.save();
    return res
      .status(200)
      .json({ data: newUser, message: "Sign up successful" });
  } catch (err) {
    res.status(500).json({ data: err });
  }
}
