import styled from "@emotion/styled";
import axios from "axios";
import { lazy, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface coord {
  longitude: number;
  latitude: number;
}
const Match = () => {
  let token = Cookies.get("authToken") || "";
  const [coordinates, setCoordinates] = useState<coord>();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setCoordinates({ latitude, longitude });
      });
    }
  }, []);

  const GetMatches = async () => {
    try {
      const res = await axios.post(
        "/api/user/match-users",
        {
          interest: "music",
          coordinates: [coordinates?.longitude, coordinates?.latitude]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const UpdateCoordinates = async (coordinates: coord) => {
      try {
        const res = await axios.post(
          "/api/user/update-coordinates",
          coordinates,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        GetMatches();
      } catch (err) {}
    };

    if (coordinates) {
      UpdateCoordinates(coordinates);
    }
  }, [coordinates, token]);

  return <Main></Main>;
};

export default Match;

const Main = styled.div`
  width: 100%;
  padding: 1rem;
`;
