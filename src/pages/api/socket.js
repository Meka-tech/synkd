import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    // console.log("Socket is already running");
  } else {
    // console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      //   socket.on("input-change", (msg) => {
      //     socket.broadcast.emit("update-input", msg);
      //   });

      socket.on("send-message", ({ toUserId, message }) => {
        // console.log(toUserId, message);
        // io.to(toUserId).emit("receive-message", {
        //   fromUserId: toUserId,
        //   message
        // });
        socket.broadcast.emit("receive-message", {
          fromUserId: toUserId,
          message
        });
      });
    });
  }
  res.end();
};

export default SocketHandler;
