var express         = require('express'),
    router          = express.Router();
var passport	    = require('passport');

const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = roles => (req, res, next) =>
  !roles.includes(req.user.role.name.toLowerCase())
    ? res.status(401).json("Unauthorized")
    : next();

// const checkRole = roles => (req, res, next) => {
//   console.log(req.user.Role.name);
// }

require('./user.routes')(router,userAuth,checkRole);
require('./role.routes')(router,userAuth,checkRole);


module.exports = router;



