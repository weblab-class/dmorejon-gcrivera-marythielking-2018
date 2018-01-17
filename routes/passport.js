const passport = require('passport');
const fbp = require('passport-facebook');
const userModel = require('../models/user').userModel;


// set up passport configs
passport.use(new fbp.Strategy({
  clientID: '132612304207672',
  clientSecret: 'c4c3e38c88b0252b15044a01aab497d4',
  callbackURL: 'user/auth/facebook/callback'
}, async (accessToken, BrefreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({fbid: profile.id});
    if (!user) {
      const newUser = new userModel({fbid: profile.id,
                                      displayname: profile.displayName});
      user = await newUser.save()
      done(null, user);
    } else {
      done(null, user);
    }
  } catch(e) {
    done(e);
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
