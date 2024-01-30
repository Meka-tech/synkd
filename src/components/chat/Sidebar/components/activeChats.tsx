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
import { updateOpenChat } from "@/Redux/features/openChat/openChatSlice";

interface INewChat {}
const ActiveChats = ({}: INewChat) => {
  const [activeChats, setActiveChats] =
    useState<{ recentMessage: ImsgType; unreadCount: number }[]>();
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

  useLiveQuery(async () => {
    const Data = await getMostRecentMessagesAndUnreadCount(userDetails?._id);
    setActiveChats(Data);
  });

  return (
    <Main>
      {activeChats?.map((item, i) => {
        const chat = item.recentMessage;
        let partner;
        let user;
        let userSent = false;

        if (chat.partner._id === userDetails?._id) {
          for (let friend of Friends) {
            if (friend._id === chat.user._id) {
              partner = friend;
            }
          }

          user = userDetails;
        } else {
          for (let friend of Friends) {
            if (friend._id === chat.partner._id) {
              partner = friend;
            }
            userSent = true;
          }
        }
        const msgTime = getChatTime(chat.createdAt);
        return (
          <ChatBox
            userSent={userSent}
            partner={partner}
            recentMsg={chat.text}
            recentMsgTime={msgTime}
            unReadMsg={item.unreadCount}
            key={i}
          />
        );
      })}
    </Main>
  );
};

export default ActiveChats;

const Main = styled.div``;
