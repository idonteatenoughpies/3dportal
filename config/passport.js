const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const validPassword = require('../lib/passwordUtils').validPassword;

// code from documentation of passport.js
const verifyCallback = (username, password, done) => {
    User.findOne({ username: username })
    .then((user) => {
        if (!user) { return done(null, false)} 

const isValid = validPassword(password, user.hash, user.salt);

if (isValid) {
    return done(null, user); 
} else {
    return done(null, false);
}
    })
    .catch((err) => {
        done(err);
    });
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(userID, done) {
    User.findById(userID)
    .then((user) => {
      done(null, user);
    })
    .catch(err => done(err))
  });

  // strategy implementation courtesy of Zach Golwitzer   https://www.youtube.com/watch?v=J1qXK66k1y4