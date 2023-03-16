module.exports = function (io) {
  io.use((socket, next) => {
    const usertoken = socket.handshake.auth.usertoken;
    if (!usertoken) {
      return next(new Error("invalid usertoken"));
    }
    socket.usertoken = usertoken;
    next();
  });
  io.on("connection", (socket) => {
    console.log("a user connected");
    // fetch existing users
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        usertoken: socket.usertoken,
      });
    }
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
      userID: socket.id,
      usertoken: socket.usertoken,
      users,
    });

    // forward the private message to the right recipient
    socket.on("private message", ({ content, to }) => {
      socket.to(to).emit("private message", {
        content,
        from: socket.id,
      });
    });

    // notify users upon disconnection
    socket.on("disconnect", () => {
      const users = [];
      for (let [id, socket] of io.of("/").sockets) {
        users.push({
          userID: id,
          usertoken: socket.usertoken,
        });
      }
      const index = users.findIndex((user) => user.userID === socket.id);
      if (index > -1) {
        users.splice(index, 1);
      }
      console.log(users);
      socket.broadcast.emit("user disconnected", { userID: socket.id, users });
    });
  });
};
