const express    = require('express');
const bodyParser = require('body-parser');
const passport   = require('passport');
const cors       = require('cors');
const app        = express();
const pkg = require('../package.json');

var corsOptions = {
  origin: global.gConfig.webapp
}
app.use(cors(corsOptions));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.json("WELCOME TO PICTD WEB API - " + pkg.version)
});

app.use(passport.initialize());
const passportMiddleware = require('./middleware/passport');
const passportGoogleMiddleware = require('./middleware/passportgoogle');
passport.use(passportMiddleware);
passport.use(passportGoogleMiddleware);
  
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
const routes = require('./routes/routes');
app.use('/api', routes);

module.exports = app;