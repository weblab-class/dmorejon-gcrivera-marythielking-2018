const passport = require('passport');
const fbp = require('passport-facebook');


// set up passport configs
passport.use(new fbp.Strategy({
  clientID: '132612304207672',
  clientSecret: 'c4c3e38c88b0252b15044a01aab497d4',
  callbackURL: '/auth/facebook/callback'
}, function(accessToken, BrefreshToken, profile, done) {
//check if user in database.
//if not, put user in ;)
//name: profile.displayName,
//fbid: profile.id
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
