import { Server } from "socket.io";

import { cors } from "micro-cors";

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"]
};

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    // console.log("Socket is already running");
  } else {
    // console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    const socketIdMap = {};
    io.on("connection", (socket) => {
      socket.on("user-online", (userId) => {
        socketIdMap[userId] = socket.id;
      });

      socket.on("post-message", ({ userId, message }) => {
        const targetSocketId = socketIdMap[userId];

        if (targetSocketId) {
          io.to(targetSocketId).emit("get-message", message);
        }
      });

      socket.on("read-message", ({ userId, messageId }) => {
        const targetSocketId = socketIdMap[userId];

        if (targetSocketId) {
          io.to(targetSocketId).emit("message-was-read", messageId);
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
    res.socket.server.io = io;
  }
  return res.socket.server.io;
};

const corsHandler = cors({
  // Adjust origin based on your needs
  origin: "*",
  methods: ["GET", "POST"]
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default corsHandler(SocketHandler);
