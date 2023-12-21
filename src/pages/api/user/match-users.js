import { authenticateJWT } from "@/utils/middleware/authJwt";
import User from "@/models/User";
import { mongooseConnect } from "../../../../lib/mongoose";
import { MatchMake } from "../../../utils/middleware/matchMake";

async function handler(req, res, next) {
  await mongooseConnect();
  let userId = authenticateJWT(req, res, next);

  const { interest, coordinates, excludedIds } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    let user = await User.findOne({ _id: userId });

    console.log(excludedIds);

    const GetNearbyUsers = async () => {
      const nearbyUsers = await User.find({
        _id: { $nin: [...excludedIds, userId] },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [...coordinates]
            },
            $maxDistance: 10000
          }
        }
      });
      return nearbyUsers;
    };

    let nearbyUsers = await GetNearbyUsers();

    if (nearbyUsers.length === 0) {
      return res.status(200).json({ message: "no user found", data: [] });
    }

    const MatchData = MatchMake(user, nearbyUsers, interest);

    return res.status(200).json({ message: "Matched", data: MatchData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const config = {
  api: {}
};

export default handler;
