const express    = require('express');
const bodyParser = require('body-parser');
const passport   = require('passport');
const cors       = require('cors');
const app        = express();

var corsOptions = {
  origin: global.gConfig.webapp
}
app.use(cors(corsOptions));
const routes = require('./routes/routes');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
 
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

app.use('/api', routes);

module.exports = app;