import axios from "axios";
import { useState, useRef, useEffect } from "react";
import {
  SpotifyAuth,
  getFollowedArtists,
  searchArtistsByGenre
} from "@/utils/spotifyApi";
import GenreItem from "@/components/music-Items/genre-item";
import styled from "@emotion/styled";
import { Music, InfoCircle } from "@emotion-icons/boxicons-regular";
import ArtistItem from "@/components/music-Items/artist-item";
import { PrimaryButton } from "@/components/buttons/primaryButton";
import useClickOutside from "../../../hooks/useClickOutside";
import { genreList } from "@/lib/genreData";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Spotify } from "@emotion-icons/boxicons-logos";
import { ButtonWithIcon } from "@/components/buttons/buttonWithIcon";
import SearchArtist from "@/components/music-Items/search-artist";

interface ArtistsState {
  [genre: string]: {
    offset: number;
    artists: any[];
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

  const [authAccessToken, setAuthAccessToken] = useState("");
  const [usedSpotify, setUsedSpotify] = useState(false);

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
          artists: [
            ...(prevState[genre]?.artists || []),
            ...(Array.isArray(data) ? data : [])
          ]
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
      await SpotifyAuth(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Check if the page was redirected with an access token
    const handleRedirect = () => {
      const hashParams = window.location.hash.substring(1).split("&");
      for (const param of hashParams) {
        const [key, value] = param.split("=");
        if (key === "access_token") {
          setAuthAccessToken(value);
        }
      }
    };

    if (window.location.hash.includes("access_token")) {
      handleRedirect();
    }
  }, []);

  const GetFollowedArtists = async () => {
    const artists = await getFollowedArtists(authAccessToken);
    const names: string[] = [];
    for (const artist of artists) {
      if (!chosenArtists.includes(artist.name)) {
        names.push(artist.name);
      }
    }
    setChosenArtists((prev) => [...prev, ...names]);
  };

  useEffect(() => {
    if (authAccessToken && !usedSpotify) {
      setUsedSpotify(true);
      GetFollowedArtists();
    }
  }, [authAccessToken]);

  return (
    <Main>
      <TopNav>
        <Header>
          <SubTitle>This will just take a moment</SubTitle>
          <Title>
            Who do you listen to ?{" "}
            <span>
              <Music size={34} style={{ marginLeft: "1rem" }} />
            </span>
          </Title>
        </Header>
        <SearchDiv>
          <SearchArtist
            chosenArtists={chosenArtists}
            select={handleAddArtist}
          />
        </SearchDiv>
      </TopNav>

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
            text="Artists you follow on Spotify"
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
        <FooterInfo>
          <InfoIcon>
            {" "}
            <InfoCircle size={20} />
          </InfoIcon>
          Pick at least 10 artists:
          <span> {chosenArtists.length} artists picked</span>
        </FooterInfo>
        <FooterButton>
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
    padding: 1rem 1.5rem;
    padding-top: 3rem;
    padding-bottom: 8rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    padding-top: 3rem;
  }
`;
const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
`;
const Header = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;
const SubTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
`;
const Title = styled.h2`
  font-size: 4rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  @media screen and (max-width: 480px) {
    font-size: 2.6rem;
    margin-bottom: 0.5rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 3rem;
  }
`;

const SearchDiv = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 480px) {
    width: 100%;
    margin-top: 0.5rem;
  }
`;

const Body = styled.div``;
const GenreBody = styled.div`
  padding: 1rem;
  overflow: hidden;
  @media screen and (max-width: 480px) {
    padding: 0;
  }
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
  background-color: ${(props) => props.theme.colors.gluton};
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
  @media screen and (max-width: 480px) {
    width: 80%;
  }
`;

const Footer = styled.div`
  padding: 1rem 5rem;
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 480px) {
    padding: 1rem 2rem;
    margin-top: 2rem;
    flex-direction: column-reverse;
  }
`;

const FooterInfo = styled.h2`
  font-size: 1.6rem;
  color: ${(props) => props.theme.colors.dusty};
  font-weight: 400;
  display: inline-flex;
  span {
    color: ${(props) => props.theme.colors.primary};
    font-size: 1.6rem;
    margin-left: 0.5rem;
    @media screen and (max-width: 480px) {
      font-size: 1.4rem;
    }
  }
  @media screen and (max-width: 480px) {
    font-size: 1.4rem;
    margin-top: 1rem;
  }
`;

const InfoIcon = styled.div`
  margin-right: 0.5rem;
`;

const FooterButton = styled.div`
  width: 25rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  @media screen and (max-width: 480px) {
    width: 80%;
  }
`;
