const config = require("./expressconfig/config");
const app = require("./server");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:8100", "https://misportal.bukidnon.gov.ph"],
    }
});
global.io = io;
require('./socketio')(io);


server.listen(
  process.env.PORT || 3000,
  process.env.IP || "0.0.0.0",
  function() {
    var addr = server.address();
    console.log("WEB API", addr.address + ":" + addr.port);
  }
);