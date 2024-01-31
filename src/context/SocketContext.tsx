import { RootState } from "@/Redux/app/store";
import { MessageDb } from "@/dexieDb/MessageLocalDb";
import { ReadDBMessage } from "@/utils/indexedDb_Functions/readDBMessage";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

interface SocketContextProps {
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
  const socketUrl: string = process.env.SOCKET_URL || "";
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useSelector((state: RootState) => state.user?.user);

  useEffect(() => {
    let newSocket: Socket;

    const socketInitializer = async (): Promise<void> => {
      const res = await fetch("/api/socket");

      newSocket = io(socketUrl);
      setSocket(newSocket);

      // socket?.on("connect", () => {
      //   console.log("connect");
      //   if (user?._id) {
      //     socket.emit("user-online", user?._id);
      //   }
      // });

      socket?.on("disconnect", () => {
        console.log("Disconnected");
      });
    };

    socketInitializer();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};
