import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { RootState } from "@/Redux/app/store";
import { ImsgType } from "@/types/messageType";
import { IUserType } from "@/types/userType";
import styled from "@emotion/styled";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

import ChatBox from "./chatBox";
import { useDispatch, useSelector } from "react-redux";
import { getMostRecentMessagesAndUnreadCount } from "@/utils/indexedDb_Functions/getMostRecentMessages";
import { updateOpenChat } from "@/Redux/features/openChat/openChatSlice";

interface INewChat {
  selectChat: Function;
}
const ActiveChats = ({ selectChat }: INewChat) => {
  const [activeChats, setActiveChats] =
    useState<{ recentMessage: ImsgType; unreadCount: number }[]>();
  const userDetails: IUserType | null = useSelector(
    (state: RootState) => state.user.user
  );

  useLiveQuery(async () => {
    const Data = await getMostRecentMessagesAndUnreadCount(userDetails?._id);
    setActiveChats(Data);
  });

  console.log(activeChats);

  return (
    <Main>
      {activeChats?.map((item, i) => {
        const chat = item.recentMessage;
        let partner;
        let user;
        let userSent = false;
        if (chat.partner._id !== userDetails?._id) {
          partner = chat.partner;
          user = chat.user;
          userSent = true;
        } else {
          partner = chat.user;
          user = chat.partner;
        }
        return (
          <ChatBox
            user={user}
            userSent={userSent}
            selectChat={selectChat}
            partner={partner}
            recentMsg={chat.text}
            readMsg={chat.readStatus}
            recentMsgTime={chat.createdAt}
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
