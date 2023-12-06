import axios from "axios";
import { useEffect, useState } from "react";
import {
  GetSpotifyToken,
  searchArtistsByGenre
} from "../../../../utils/spotifyApi";
import GenreItem from "@/components/music-Items/genre-item";
import styled from "@emotion/styled";
import { Music } from "@emotion-icons/boxicons-regular";
import ArtistItem from "@/components/music-Items/artist-item";
import { PrimaryButton } from "@/components/buttons/primaryButton";

interface ArtistsState {
  [genre: string]: {
    offset: number;
    artists: any[]; // Replace 'any' with the actual type of your artists array
  };
}

const Interests = () => {
  const [artists, setArtists] = useState<ArtistsState>({});
  const [loading, setLoading] = useState(false);

  const GetArtists = async (genre: string, more: boolean = false) => {
    setLoading(true);
    try {
      let offset = 0;
      if (more) {
        offset = artists[genre]?.offset * 20;
      }

      const data = await searchArtistsByGenre(genre, 20, offset);

      setArtists((prevState) => ({
        ...prevState,
        [genre]: {
          offset: (prevState[genre]?.offset || 0) + 1,
          artists: [...(prevState[genre]?.artists || []), ...data]
        }
      }));
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const RemoveGenre = (genre: string) => {
    setArtists((prevState) => {
      const { [genre]: omittedGenre, ...newState } = prevState;
      return newState;
    });
  };

  const genreList = [
    "afrobeats",
    "Pop",
    "Rap",
    "Hip-hop",
    "pop rock",
    "classical",
    "rock",
    "R&B",
    "punk rock",
    "metal",
    "folk",
    "jazz",
    "blues",
    "highlife",
    "juju",
    "alté",
    "k-pop"
  ];

  return (
    <Main>
      <Title>
        Who do you listen to ?{" "}
        <span>
          <Music size={34} style={{ marginLeft: "1rem" }} />
        </span>
      </Title>
      <Body>
        <GenreBody>
          <GenreList>
            {genreList.map((genre, i) => (
              <GenreItem
                name={genre}
                key={i}
                onClick={() => {
                  if (artists[genre]?.artists) {
                    RemoveGenre(genre);
                    return;
                  }
                  GetArtists(genre);
                }}
              />
            ))}
          </GenreList>
        </GenreBody>
        <ArtistBody>
          {genreList.map((genre, id) => {
            if (!artists[genre]?.artists) {
              return;
            }
            return (
              <ArtistList key={id}>
                {artists[genre]?.artists && <GenreHeader>{genre}</GenreHeader>}
                <ArtistsDiv>
                  {artists[genre]?.artists?.map((artist, i) => {
                    return <ArtistItem name={artist.name} key={i} />;
                  })}
                </ArtistsDiv>
                {artists[genre]?.artists && (
                  <LoadMoreButton>
                    <PrimaryButton
                      text="More"
                      variant
                      loading={loading}
                      onClick={() => {
                        GetArtists(genre, true);
                      }}
                    />{" "}
                  </LoadMoreButton>
                )}
              </ArtistList>
            );
          })}
        </ArtistBody>
      </Body>
    </Main>
  );
};

export default Interests;

const Main = styled.div`
  width: 100%;
  height: 100dvh;
  padding: 2rem;
  padding-left: 5rem;
  padding-top: 5rem;
  background-color: #313030;
`;
const Title = styled.h2`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 3rem;
  display: inline-flex;
  align-items: center;
`;

const Body = styled.div`
  display: flex;
  justify-content: space-between;
`;
const GenreBody = styled.div`
  padding: 1rem;
  overflow: hidden;
  width: 50rem;
`;
const GenreList = styled.div`
  display: flex;
  grid-gap: 10px;
  flex-wrap: wrap;
`;

const ArtistBody = styled.div`
  width: 60%;
  height: fit-content;
  max-height: 70dvh;
  overflow-y: scroll;
`;
const ArtistsDiv = styled.div`
  display: flex;
  grid-gap: 5px;
  justify-content: space-between;
  /* flex-wrap: wrap; */
  overflow-x: scroll;

  height: 5rem;
`;
const ArtistList = styled.div`
  background-color: black;
  max-height: 40dvh;
  max-width: 100%;
  margin-bottom: 2rem;
  border-radius: 10px;
  padding: 1rem;
`;
const GenreHeader = styled.h1`
  font-size: 1.6rem;
  font-weight: 600;
  text-transform: capitalize;
  text-align: center;
  margin-bottom: 2rem;
`;
const LoadMoreButton = styled.div`
  width: 8rem;
  margin-left: auto;
  margin-right: auto;
`;
