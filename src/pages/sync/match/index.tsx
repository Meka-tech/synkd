import styled from "@emotion/styled";
import axios from "axios";
import { lazy, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import DropdownInput from "@/components/Inputs/dropdownInput";
import { SyncLottie } from "../../../../animation/syncLottie";
import MatchedUser from "@/components/match/matched-user";

interface coord {
  longitude: number;
  latitude: number;
}
const Match = () => {
  const router = useRouter();
  let token = Cookies.get("authToken") || "";
  const [coordinates, setCoordinates] = useState<coord>();
  const [interest, setInterest] = useState("music");
  const [matchingType, setMatchingType] = useState("proximity");
  const [matchedUsers, setMatchedUsers] = useState<
    { user: { username: string }; percent: number }[]
  >([]);
  const [excludedIdList, setExcludedIdList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const MatchOptions = {
    all: ["music", "movies", "sports", "video-games"],
    premium: ["movies", "sports", "video-games"]
  };
  const MatchType = {
    all: ["proximity", "worldwide"],
    premium: ["worldwide"]
  };

  const [hasSynk, setHasSynk] = useState(false);
  const GetUser = async (token: string | null) => {
    try {
      if (token) {
        const data = await axios.get("/api/user/get-user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let res = data.data.user;
        if (res.interests.music.length < 1) {
          router.push("/sync/interests");
        }
        return true;
      }
      return false;
    } catch (e) {
      router.push("/auth/sign-in");
    }
  };

  useEffect(() => {
    //redirect if no music interests
    GetUser(token);

    //get location coordinates
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setCoordinates({ latitude, longitude });
      });
    }
  }, []);

  const GetMatches = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/user/match-users",
        {
          interest,
          coordinates: [coordinates?.longitude, coordinates?.latitude],
          excludedIds: excludedIdList
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = res.data.data;
      setLoading(false);
      setMatchedUsers((prev) => [...prev, ...data]);

      //so the same users won't be returned
      const ids = data.map((item: { user: { _id: any } }) => item.user._id);
      setExcludedIdList((prev) => [...prev, ...ids]);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    //update coordinates
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
      } catch (err) {}
    };

    if (coordinates) {
      UpdateCoordinates(coordinates);
    }
  }, [coordinates, token]);

  ///////////////////////////////////
  //////////////////////////////////

  return (
    <Main>
      <TopBar>
        <DropdownDiv>
          <DropdownDescription>
            <span>Synk </span>
            with like-minds
          </DropdownDescription>
          <DropdownInput
            defaultString={interest}
            options={MatchOptions.all}
            premiumList={MatchOptions.premium}
            selectItem={setInterest}
            premiumPrivileges={false}
          />
        </DropdownDiv>

        <HeaderText>
          <span>Get </span>SYNKD
        </HeaderText>
        <DropdownDiv>
          <DropdownDescription>
            <span>Synk </span> nearby or worldwide
          </DropdownDescription>
          <DropdownInput
            defaultString={matchingType}
            options={MatchType.all}
            premiumList={MatchType.premium}
            selectItem={setMatchingType}
            premiumPrivileges={false}
          />
        </DropdownDiv>
      </TopBar>
      <Body hasSynkd={matchedUsers.length > 0}>
        <SyncButton
          hasSynkd={matchedUsers.length > 0}
          onClick={() => GetMatches()}
        >
          {loading ? (
            <SyncLottie />
          ) : (
            <SyncText hasSynkd={matchedUsers.length > 0}>
              {matchedUsers.length === 0 ? "SYNK" : "RE-SYNK"}
            </SyncText>
          )}
        </SyncButton>
        <UsersContainer hasSynkd={matchedUsers.length > 0}>
          {matchedUsers?.map(({ user, percent }, index) => {
            return <MatchedUser key={index} user={user} percent={percent} />;
          })}
        </UsersContainer>
        {!coordinates && (
          <Information>
            Give Location Permission and refresh to Synk
          </Information>
        )}
      </Body>
    </Main>
  );
};

export default Match;

const Main = styled.div`
  width: 100%;
  height: 100dvh;
`;

const TopBar = styled.div`
  padding: 2rem 1rem;
  width: 100%;
  height: 10rem;
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: 1fr 1fr 1fr;
`;

const HeaderText = styled.h1`
  text-align: center;
  font-size: 3rem;
  color: ${(props) => props.theme.colors.primary};
  @media screen and (max-width: 480px) {
    font-size: 2.5rem;
  }
  span {
    color: white;
    font-size: 3rem;
    @media screen and (max-width: 480px) {
      font-size: 2.5rem;
    }
  }
`;
const DropdownDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DropdownDescription = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
  span {
    color: ${(props) => props.theme.colors.primary};
    font-size: 1.4rem;
    @media screen and (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

interface SynkDetails {
  hasSynkd: boolean;
}
const Body = styled.div<SynkDetails>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.hasSynkd ? "space-between" : "center")};
  align-items: center;
  height: calc(100dvh - 10rem);
  transition: all ease 0.5s;
  padding: 0 3rem;
  position: relative;
  @media screen and (max-width: 480px) {
    flex-direction: column;
    padding: 1rem 1.5rem;
    padding-top: 2rem;
  }
`;

const SyncButton = styled.div<SynkDetails>`
  width: ${(props) => (props.hasSynkd ? "20rem" : "35rem")};
  height: ${(props) => (props.hasSynkd ? "20rem" : "35rem")};
  box-shadow: 0px 0px 42px -36px rgb(0, 150, 255);
  border-radius: 50%;
  cursor: pointer;
  background-color: #121111;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  :hover {
    transform: scale(1.05);
    box-shadow: 0px 0px 55px -31px rgb(0, 150, 255);
  }
  @media screen and (max-width: 480px) {
    width: ${(props) => (props.hasSynkd ? "15rem" : "30rem")};
    height: ${(props) => (props.hasSynkd ? "15rem" : "30rem")};
  }
`;

const SyncText = styled.h2<SynkDetails>`
  font-size: ${(props) => (props.hasSynkd ? "2rem" : "2.5rem")};
  @media screen and (max-width: 480px) {
    font-size: ${(props) => (props.hasSynkd ? "1.8rem" : "2.2rem")};
  }
`;

const UsersContainer = styled.div<SynkDetails>`
  width: 45%;
  height: 45rem;
  border-radius: 10px;
  overflow-y: scroll;
  position: ${(props) => (props.hasSynkd ? "relative" : "absolute")};
  transform: ${(props) =>
    props.hasSynkd ? "translateX(0)" : "translateX(150%)"};

  transition: all 0.5s ease;
  @media screen and (max-width: 480px) {
    width: 100%;
    height: 60%;
    margin-bottom: 1rem;
  }
`;

const Information = styled.h2`
  position: absolute;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  font-size: 1.4rem;
`;
