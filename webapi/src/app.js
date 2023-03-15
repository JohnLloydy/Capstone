const config = require("./expressconfig/config");
const app = require("./server");
const http = require("http");
const server = http.createServer(app);

server.listen(
  process.env.PORT || 3000,
  process.env.IP || "0.0.0.0",
  function() {
    var addr = server.address();
    console.log("WEB API", addr.address + ":" + addr.port);
  }
);