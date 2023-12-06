import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  GetSpotifyToken,
  searchArtistsByGenre
} from "../../../../utils/spotifyApi";

const Interests = () => {
  const Stuff = async () => {
    await GetSpotifyToken();
    // const data = await searchArtistsByGenre("afrobeats");
  };

  // Stuff();
  return <div></div>;
};

export default Interests;
