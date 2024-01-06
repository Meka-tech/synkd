import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    // console.log("Socket is already running");
  } else {
    // console.log("Socket is initializing");
    const io = new Server(res.socket.server.httpServer, {
      cors: {
        origin: "*"
      }
    });
    res.socket.server.io = io;
    const socketIdMap = {};
    io.on("connection", (socket) => {
      socket.on("user-online", (userId) => {
        socketIdMap[userId] = socket.id;
        console.log(socketIdMap);
      });

      socket.on("post-message", ({ userId, message }) => {
        const targetSocketId = socketIdMap[userId];

        if (targetSocketId) {
          io.to(targetSocketId).emit("get-message", message);
        }
      });

      socket.on("disconnect", () => {
        const disconnectedUserId = Object.keys(socketIdMap).find(
          (key) => socketIdMap[key].id === socket.id
        );

        if (disconnectedUserId) {
          delete socketIdMap[disconnectedUserId];
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
