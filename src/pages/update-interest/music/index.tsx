import { RootState } from "@/Redux/app/store";
import { IUserType } from "@/types/userType";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import { searchArtistsByGenre } from "@/utils/spotifyApi";
import axios from "axios";
import GenreItem from "@/components/music-Items/genre-item";
import { genreList } from "../../../../lib/genreData";
import { PrimaryButton } from "@/components/buttons/primaryButton";
import ArtistItem from "@/components/music-Items/artist-item";
import useClickOutside from "@/hooks/useClickOutside";
import { ArrowIosBack } from "@emotion-icons/evaicons-solid";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { updateUser } from "@/Redux/features/user/userSlice";
import { Spotify } from "@emotion-icons/boxicons-logos";
import { ButtonWithIcon } from "@/components/buttons/buttonWithIcon";

interface ArtistsState {
  [genre: string]: {
    offset: number;
    artists: any[]; // Replace 'any' with the actual type of your artists array
  };
}
const UpdateMusic = () => {
  const user: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );
  const router = useRouter();
  const [chosenArtists, setChosenArtists] = useState<string[]>(
    user?.interests.music || []
  );
  const [artists, setArtists] = useState<ArtistsState>({});
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  let token = Cookies.get("authToken") || "";
  const dispatch = useDispatch();

  const ModalRef = useRef(null);

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

  const UpdateMusic = async () => {
    setIsUpdating(true);
    try {
      const requestBody = { interest: "music", data: chosenArtists };
      if (token) {
        const res = await axios.post("/api/user/update/interest", requestBody, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const NewUser = res.data.user;
        dispatch(updateUser(NewUser));
        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
    setIsUpdating(false);
  };
  return (
    <Main>
      <Genres>
        <Header>
          <BackIcon
            onClick={() => {
              router.back();
            }}
          >
            <ArrowIosBack size={30} />
          </BackIcon>
          <Title>Update Your Music taste</Title>
        </Header>
        <Grid>
          {genreList.map((genre, i) => (
            <GenreItem
              size="80"
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
        </Grid>
      </Genres>
      <TextContent>
        <Info>{chosenArtists.length} artists picked</Info>
        {open && (
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
        )}

        <UpdateButton>
          <PrimaryButton
            text="Update"
            disabled={chosenArtists.length < 10}
            loading={isUpdating}
            onClick={() => UpdateMusic()}
          />
        </UpdateButton>
        <SpotifyButton>
          <ButtonWithIcon
            icon={<Spotify size={20} color="#1db954" />}
            variant
            text="Use Spotify"
            // onClick={() => UseSpotify()}
          />
        </SpotifyButton>
      </TextContent>
    </Main>
  );
};

export default UpdateMusic;

const Main = styled.div`
  width: 100%;
  height: 100dvh;
  padding: 1rem;
  display: flex;
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
`;

const Genres = styled.div`
  width: 50%;
  padding: 2rem;
  @media screen and (max-width: 480px) {
    width: 100%;
    height: auto;
    padding: 1rem;
  }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  @media screen and (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;
const BackIcon = styled.div`
  cursor: pointer;
`;
const Title = styled.h1`
  font-size: 2.5rem;
  margin-left: 1rem;
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;
const Grid = styled.div`
  display: flex;
  grid-gap: 15px;
  flex-wrap: wrap;
  @media screen and (max-width: 480px) {
    grid-gap: 7px;
  }
`;

const TextContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  flex-direction: column;
  @media screen and (max-width: 480px) {
    width: 100%;
    height: auto;
    margin-top: 2rem;
  }
`;
const Info = styled.h3`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  @media screen and (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;

const PseudoModal = styled.div`
  width: 50rem;
  background-color: ${(props) => props.theme.colors.gluton};
  padding: 2rem 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  @media screen and (max-width: 480px) {
    width: 80%;
    padding: 1rem;
  }
`;
const PseudoModalBody = styled.div``;

const ArtistsDiv = styled.div`
  padding: 1rem;
  height: 30rem;
  overflow-y: scroll;
  margin-bottom: 1rem;
  @media screen and (max-width: 480px) {
    height: 20rem;
  }
`;
const ArtistList = styled.div`
  height: 100%;
`;

const GenreHeader = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 1rem;
  @media screen and (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
  }
`;
const LoadMoreButton = styled.div`
  width: fit-content;
  margin-left: auto;
`;

const UpdateButton = styled.div`
  width: 20rem;
  margin-top: 1rem;
`;
const SpotifyButton = styled.div`
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
  @media screen and (max-width: 480px) {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`;
