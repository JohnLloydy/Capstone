var User = require("../models/user");
var Role = require("../models/role");

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: global.gConfig.jwtSecret
}

module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    //mysql version
    User.findOne({
        where: {
            id: jwt_payload.id
        },
        include: [{
            model: Role,
            require: true,
        }, ],
    }).then(user => {
        if (user) {
            return done(null, user);
        }
    }).catch(err => {
        return done(err, false);
    });
});