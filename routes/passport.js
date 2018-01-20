const passport = require('passport');
const fbp = require('passport-facebook');
const userModel = require('../models/user').userModel;


// set up passport configs
passport.use(new fbp.Strategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  // callbackURL: 'https://greenspace2018.herokuapp.com/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'picture.type(large)']
}, async (accessToken, BrefreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({fbid: profile.id});
    if (!user) {
      const newUser = new userModel({fbid: profile.id,
                                      displayname: profile.displayName,
                                      photo: profile.photos[0].value});
      user = await newUser.save()
      done(null, user);
    } else {
      await userModel.findOneAndUpdate({fbid: profile.id} ,
                                        {displayname: profile.displayName,
                                          photo: profile.photos[0].value});
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
