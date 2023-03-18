const config = require("./expressconfig/config");
// const app = require("./server");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const app = express();
const pkg = require("../package.json");

var corsOptions = {
  origin: global.gConfig.webapp,
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.json("WELCOME TO PICTD WEB API - " + pkg.version);
});

app.use(passport.initialize());
const passportMiddleware = require("./middleware/passport");
const passportGoogleMiddleware = require("./middleware/passportgoogle");
passport.use(passportMiddleware);
passport.use(passportGoogleMiddleware);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
const routes = require("./routes/routes");
app.use("/api", routes);

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
   },
    allowEIO3: true,
   });
// const wrapMiddlewareForSocketIo = middleware => (socket, next) => middleware(socket.request, {}, next);
// io.use(wrapMiddlewareForSocketIo(passport.initialize()));
// io.use(wrapMiddlewareForSocketIo(passport.session()));
// io.use(wrapMiddlewareForSocketIo(passport.authenticate(['jwt'])));

global.io = io;
require("./socketio")(io);

server.listen(
  process.env.PORT || 3000,
  process.env.IP || "0.0.0.0",
  function () {
    var addr = server.address();
    console.log("WEB API", addr.address + ":" + addr.port);
  }
);
