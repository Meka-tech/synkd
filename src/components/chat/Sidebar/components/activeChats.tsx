import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { RootState } from "@/Redux/app/store";
import { ImsgType } from "@/types/messageType";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import getChatTime from "@/utils/chat__functions/getChatTime";

import ChatBox from "./chatBox";
import { useDispatch, useSelector } from "react-redux";
import { getMostRecentMessagesAndUnreadCount } from "@/utils/indexedDb_Functions/getMostRecentMessages";
import { Plus } from "@emotion-icons/boxicons-regular";
import { updateSlide } from "@/Redux/features/slides/slide";
import { IUmsgType } from "@/types/unsentMessageType";
import { date } from "yup";

interface INewChat {
  searchValue: string;
  filter: Boolean;
}
const ActiveChats = ({ searchValue, filter }: INewChat) => {
  const dispatch = useDispatch();
  const [activeChats, setActiveChats] =
    useState<{ recentMessage: IUmsgType | ImsgType; unreadCount: number }[]>();

  const ReduxFriends: IUserType[] | [] = useSelector(
    (state: RootState) => state.friends.friends
  );

  const [Friends, setFriends] = useState(ReduxFriends);
  const userDetails: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  useEffect(() => {
    setFriends(ReduxFriends);
  }, [ReduxFriends]);

  const StartNewChat = () => {
    dispatch(updateSlide("newChat"));
  };

  useLiveQuery(async () => {
    const Data = await getMostRecentMessagesAndUnreadCount(userDetails?._id);
    setActiveChats(Data);
  });

  function isImsgType(message: IUmsgType | ImsgType): message is ImsgType {
    return (message as ImsgType).partner !== undefined;
  }

  return (
    <Main>
      {activeChats && activeChats?.length > 0 ? (
        activeChats?.map((item, i) => {
          const chat = item.recentMessage;

          let partner;
          let userSent = false;
          let user;
          let msgTime;
          let unSent = false;

          if (!isImsgType(chat)) {
            //unsent message
            unSent = true;

            if (chat.partnerId === userDetails?._id) {
              const friend = Friends.find(
                (friend) => friend._id === chat.userId
              );
              if (friend) {
                return;
              }
              partner = friend;
              user = userDetails;
            } else {
              const friend = Friends.find(
                (friend) => friend._id === chat.partnerId
              );

              if (!friend) {
                return;
              }
              partner = friend;
              userSent = true;
            }
            msgTime = getChatTime(new Date());
          } else {
            //sentmessage
            if (chat.partner._id === userDetails?._id) {
              const friend = Friends.find(
                (friend) => friend._id === chat.user._id
              );

              if (!friend) {
                return;
              }
              partner = friend;
              user = userDetails;
            } else {
              const friend = Friends.find(
                (friend) => friend._id === chat.partner._id
              );

              if (!friend) {
                return;
              }
              partner = friend;
              userSent = true;
            }
            msgTime = getChatTime(chat.createdAt);
          }

          ///////////////////////////////

          if (
            searchValue !== "" &&
            !partner?.username.toLowerCase().includes(searchValue.toLowerCase())
          ) {
            return;
          }

          if (filter && item.unreadCount < 1) {
            return;
          }
          return (
            <ChatBox
              userSent={userSent}
              partner={partner}
              recentMsg={chat.text}
              recentMsgTime={msgTime}
              unReadMsg={item.unreadCount}
              unSent={unSent}
              key={i}
            />
          );
        })
      ) : (
        <NoActiveChats>
          {" "}
          <NoChatText>Start a new chat</NoChatText>
          <AddIcon onClick={() => StartNewChat()}>
            <Plus size={30} />
          </AddIcon>
        </NoActiveChats>
      )}
    </Main>
  );
};

export default ActiveChats;

const Main = styled.div`
  position: relative;
  height: 95%;
`;

const NoActiveChats = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  position: absolute;
  align-items: center;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const NoChatText = styled.h2`
  font-size: 3rem;
  margin-bottom: 1rem;
`;
const AddIcon = styled.div`
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary};
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
