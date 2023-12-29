import axios from "axios";
import { useState, useRef } from "react";
import { searchArtistsByGenre } from "@/utils/spotifyApi";
import GenreItem from "@/components/music-Items/genre-item";
import styled from "@emotion/styled";
import { Music } from "@emotion-icons/boxicons-regular";
import ArtistItem from "@/components/music-Items/artist-item";
import { PrimaryButton } from "@/components/buttons/primaryButton";
import useClickOutside from "../../../hooks/useClickOutside";
import { genreList } from "../../../../lib/genreData";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Spotify } from "@emotion-icons/boxicons-logos";
import { ButtonWithIcon } from "@/components/buttons/buttonWithIcon";

interface ArtistsState {
  [genre: string]: {
    offset: number;
    artists: any[]; // Replace 'any' with the actual type of your artists array
  };
}

const Interests = () => {
  const [artists, setArtists] = useState<ArtistsState>({});
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const ModalRef = useRef(null);
  const [chosenArtists, setChosenArtists] = useState<string[]>([]);
  let token = Cookies.get("authToken") || "";

  const router = useRouter();

  useClickOutside(ModalRef, () => {
    setOpen(false);
    setSelectedGenre("");
  });

  const GetArtists = async (genre: string, more: boolean = false) => {
    setLoading(true);
    try {
      let offset = 0;
      let data: string[] = [];
      if (more) {
        offset = artists[genre]?.offset * 20;
      }

      data = await searchArtistsByGenre(genre, 20, offset);

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

  const handleAddArtist = (artist: any) => {
    const picked = chosenArtists.includes(artist);
    if (picked) {
      const newArray = chosenArtists.filter((item) => item !== artist);
      setChosenArtists(newArray);
    } else {
      setChosenArtists((prevArray) => [...prevArray, artist]);
    }
  };

  const SaveArtists = async () => {
    setIsSaving(true);
    try {
      const requestBody = { interest: "music", data: chosenArtists };
      if (token) {
        const data = await axios.post("/api/user/post-interest", requestBody, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        router.push("/sync/match");
      }
    } catch (e) {
      console.log(e);
    }
    setIsSaving(false);
  };

  const UseSpotify = async () => {
    try {
      await axios.get("/api/spotify/spotify-login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Main>
      <Header>
        <div>
          <SubTitle>This will just take a moment</SubTitle>
          <Title>
            Who do you listen to ?{" "}
            <span>
              <Music size={34} style={{ marginLeft: "1rem" }} />
            </span>
          </Title>
        </div>
        <Info>Please pick at least 10 artists</Info>
      </Header>

      <Body>
        <GenreBody>
          <GenreList>
            {genreList.map((genre, i) => (
              <GenreItem
                name={genre.name}
                bgImage={genre.image}
                key={i}
                onClick={() => {
                  setOpen(true);
                  setSelectedGenre(genre.name);
                  if (artists[genre.name]?.artists) {
                    return;
                  }
                  GetArtists(genre.name);
                }}
              />
            ))}
          </GenreList>
        </GenreBody>
        <SpotifyButton>
          <ButtonWithIcon
            icon={<Spotify size={20} color="#1db954" />}
            variant
            text="Use Spotify"
            onClick={() => UseSpotify()}
          />
        </SpotifyButton>
      </Body>
      {open && (
        <PseudoBackdrop>
          <PseudoModal ref={ModalRef}>
            <PseudoModalBody>
              <GenreHeader>{selectedGenre}</GenreHeader>
              {genreList.map((genre, id) => {
                if (!artists[genre.name]?.artists) {
                  return;
                }
                if (selectedGenre === genre.name) {
                  return (
                    <ArtistsDiv key={id}>
                      <ArtistList>
                        {artists[selectedGenre]?.artists?.map((artist, i) => {
                          return (
                            <ArtistItem
                              onClick={() => {
                                handleAddArtist(artist.name);
                              }}
                              selected={chosenArtists.includes(artist.name)}
                              name={artist.name}
                              key={i}
                            />
                          );
                        })}
                      </ArtistList>
                    </ArtistsDiv>
                  );
                }
              })}
              <LoadMoreButton>
                <PrimaryButton
                  text="Load more"
                  variant
                  loading={loading}
                  onClick={() => {
                    GetArtists(selectedGenre, true);
                  }}
                />
              </LoadMoreButton>
            </PseudoModalBody>
          </PseudoModal>
        </PseudoBackdrop>
      )}
      <Footer>
        <FooterInfo> {chosenArtists.length} artist(s) picked</FooterInfo>
        <FooterButton>
          {" "}
          <PrimaryButton
            text="Save"
            disabled={chosenArtists.length < 10}
            onClick={() => SaveArtists()}
            loading={isSaving}
          />
        </FooterButton>
      </Footer>
    </Main>
  );
};

export default Interests;

const Main = styled.div`
  width: 100%;
  min-height: 100dvh;
  max-height: fit-content;
  padding: 2rem;
  padding-left: 5rem;
  padding-top: 5rem;
  position: relative;
  overflow: hidden;
  @media screen and (max-width: 480px) {
    padding: 2rem;
    padding-top: 3rem;
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
`;
const SubTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;
const Title = styled.h2`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 3rem;
  display: inline-flex;
  align-items: center;
  @media screen and (max-width: 480px) {
    font-size: 2.6rem;
    margin-bottom: 0.5rem;
  }
`;

const Info = styled.h3`
  font-size: 1.6rem;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Body = styled.div`
  margin-bottom: 4rem;
`;
const GenreBody = styled.div`
  padding: 1rem;
  overflow: hidden;
`;
const GenreList = styled.div`
  display: flex;
  grid-gap: 10px;
  flex-wrap: wrap;
  @media screen and (max-width: 480px) {
    grid-gap: 7px;
  }
`;
const PseudoBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PseudoModal = styled.div`
  width: 50rem;
  background-color: #252525;
  padding: 2rem 2rem;
  border-radius: 10px;
  @media screen and (max-width: 480px) {
    width: 90%;
  }
`;
const PseudoModalBody = styled.div``;

const ArtistsDiv = styled.div`
  padding: 1rem;
  height: 30rem;
  overflow-y: scroll;
  margin-bottom: 1rem;
`;
const ArtistList = styled.div`
  height: 100%;
`;

const GenreHeader = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 1rem;
`;
const LoadMoreButton = styled.div`
  width: fit-content;
  margin-left: auto;
`;

const SpotifyButton = styled.div`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
`;

const Footer = styled.div`
  padding: 1rem 5rem;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  @media screen and (max-width: 480px) {
    padding: 1rem 2rem;
  }
`;

const FooterInfo = styled.h2`
  font-size: 1.6rem;
  @media screen and (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const FooterButton = styled.div`
  width: 8rem;
`;
