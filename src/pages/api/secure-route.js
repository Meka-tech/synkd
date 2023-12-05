import { authenticateJWT } from "../../utils/authMiddleware";

function handler(req, res) {
  // Your secure route logic goes here
  res.status(200).json({ message: "Access granted!", user: req.user });
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default authenticateJWT(handler);
