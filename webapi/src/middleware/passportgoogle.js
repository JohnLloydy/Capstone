require('dotenv').config();

const {User, Role} = require("../models/user");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } =  process.env;


module.exports = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/return'
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOne({ include: [
      {
        model: Role,
        require: true,
      },
    ],
    where: {
      email: profile._json.email,
    },}).then((currentUser)=>{
      if(currentUser){
        //if we already have a record with the given profile ID
        return cb(null, currentUser);
      } else{
           //if not, create a new user 
          new User({
            name: profile.displayName,
            email: profile._json.email,
            password: profile.id,
            photo:profile._json.picture,
            roleid: 2,
            provider: profile.provider
          }).save().then((newUser) =>{
            return cb(null, newUser);
          });
       } 
    })
  });
  
