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
  const socketUrl: string = process.env.NEXT_PUBLIC_SOCKET_URL || "";
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket;

    const socketInitializer = async (): Promise<void> => {
      // const res = await fetch("/api/socket");
      // const res = await fetch(socketUrl);

      newSocket = io(socketUrl);
      setSocket(newSocket);

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
