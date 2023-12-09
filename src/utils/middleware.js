import jwt from "jsonwebtoken";

export function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  console.log(req.headers);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
