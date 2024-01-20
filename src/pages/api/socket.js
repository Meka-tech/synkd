import { Server } from "socket.io";
import cors from "cors";

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    // console.log("Socket is already running");
  } else {
    // console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      cors: {
        origin: "*", // You might want to restrict this to specific domains in production
        methods: ["GET", "POST"]
      }
    });
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

      socket.on("is-typing", ({ from, to }) => {
        const targetSocketId = socketIdMap[to];

        if (targetSocketId) {
          io.to(targetSocketId).emit("userTyping", from);
        }
      });

      socket.on("send-notification", ({ from, to }) => {
        const targetSocketId = socketIdMap[to];

        if (targetSocketId) {
          io.to(targetSocketId).emit("receive-notification", from);
        }
      });

      socket.on("profile-updated", ({ from, friends }) => {
        let targetSocketIds = [];
        friends.map((friend) => {
          let id = socketIdMap[friend];
          targetSocketIds.push(id);
        });

        if (targetSocketIds.length > 0) {
          for (const target of targetSocketIds) {
            io.to(target).emit("update-profile", from);
          }
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
