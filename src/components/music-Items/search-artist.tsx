import styled from "@emotion/styled";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { Search } from "@emotion-icons/boxicons-regular";
import axios from "axios";
import { GetSpotifyToken } from "@/utils/spotifyApi";
import ArtistItem from "./artist-item";
import useClickOutside from "@/hooks/useClickOutside";
import { LoadingLottie, LoadingVariantLottie } from "../../../animation";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  chosenArtists: string[];
  select: Function;
}
const SearchArtist = ({ select, chosenArtists, ...rest }: IProps) => {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const [searchResult, setSearchResult] = useState<{ name: string }[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const SearchArtist = async () => {
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        text
      )}&type=artist`;
      setSearching(true);
      try {
        const token = await GetSpotifyToken();
        const response = await axios.get(searchUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const originalArray = response.data.artists.items;

        const uniqueArray = originalArray.reduce(
          (accumulator: any[], currentValue: { name: any }) => {
            if (!accumulator.includes(currentValue.name)) {
              accumulator.push(currentValue);
            }
            return accumulator;
          },
          []
        );

        setSearchResult(uniqueArray);
      } catch (err) {}
      setSearching(false);
    };

    if (text !== "" && focused) {
      SearchArtist();
    }
  }, [text, focused]);

  useClickOutside(inputRef, () => {
    setFocused(false);
  });

  const artists = [];
  return (
    <Main ref={inputRef}>
      <Body focused={focused}>
        <Icon focused={focused}>
          <Search size={25} />
        </Icon>
        <Input
          onFocus={() => setFocused(true)}
          // onBlur={() => setFocused(false)}
          {...rest}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search for your favourite artists..."
          // onKeyDown={handleKeyPress}
        />
        {searching && <LoadingVariantLottie />}
      </Body>
      {searchResult.length > 0 && focused && text !== "" ? (
        <ResultDiv>
          {searchResult.map((result, i) => {
            return (
              <ArtistItem
                name={result.name}
                selected={chosenArtists.includes(result.name)}
                onClick={() => select(result.name)}
                key={i}
              />
            );
          })}
        </ResultDiv>
      ) : searchResult.length == 0 && focused && text !== "" ? (
        <ResultDiv>
          <NoResults>No results</NoResults>{" "}
        </ResultDiv>
      ) : null}
    </Main>
  );
};

export default SearchArtist;

const Main = styled.div`
  position: relative;
  width: 60rem;
  @media screen and (max-width: 480px) {
    width: 100%;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    width: 45rem;
  }
`;

interface IinputStyles {
  focused: boolean;
}

const Body = styled.div<IinputStyles>`
  width: 100%;
  padding: 0.5rem 2rem;
  background-color: ${(props) => props.theme.colors.gluton};
  height: 5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all ease-in 0.25s;
  @media screen and (max-width: 480px) {
    height: 4rem;
    padding: 0.5rem 1rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    height: 4rem;
  }
`;
const Icon = styled.div<IinputStyles>`
  /* color: ${(props) =>
    props.focused
      ? `${props.theme.colors.primary} `
      : `${props.theme.colors.snow}`}; */
  margin-right: 1rem;
  color: ${(props) => props.theme.colors.dusty};
  @media screen and (max-width: 480px) {
    margin-right: 0.5rem;
  }
`;
const Input = styled.input`
  border: none;
  outline: none;
  width: 95%;
  height: 100%;
  background-color: transparent;
  font-size: 1.6rem;
  font-weight: 500;
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    font-size: 1.4rem;
  }
  @media screen and (max-width: 480px) {
    font-size: 1.6rem;
  }

  ::placeholder {
    color: ${(props) => props.theme.colors.dusty};
    font-weight: 300;
  }

  &:-webkit-autofill {
    background-color: transparent !important;
    box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0) inset; /* Override background color */
    background-clip: text;
  }
`;

const ResultDiv = styled.div`
  position: absolute;
  bottom: 0;
  transform: translateY(105%);
  background-color: ${(props) => props.theme.colors.gluton};
  height: auto;
  max-height: 45rem;
  width: 100%;
  border-radius: 8px;
  padding: 0 1rem;
  z-index: 100;
  overflow-y: scroll;
  padding-bottom: 1rem;
  box-shadow: 0px 10px 15px 7px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: 480px) {
    transform: translateY(102%);
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    transform: translateY(102%);
  }
`;

const NoResults = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 1rem 0;
  font-size: 1.6rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.dusty};
  @media screen and (max-width: 480px) {
    margin-top: 0.5rem;
    padding: 0.5rem 0;
    font-size: 1.4rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1600px) {
    margin-top: 0.5rem;
    padding: 0.5rem 0;
    font-size: 1.4rem;
  }
`;
