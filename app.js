require('dotenv').load();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./routes/passport');
const utils = require('./utils');

const greenspace = require('./routes/greenspace');
const review = require('./routes/review');
const event = require('./routes/event');
const user = require('./routes/user');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/greenspace', {
  useMongoClient: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const app = express();

// Serve static assets from the public folder in project root
app.use(express.static('public'));

// Set up some middleware to use.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser());

// set up sessions
app.use(session({
  secret: 'session-secret',
  resave: 'false',
  saveUninitialized: 'true'
}));

// hook up passport
app.use(passport.initialize());
app.use(passport.session());

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    { failureRedirect: '/' }
  ),
  function(req, res) {
    res.redirect(process.env.BASE_URL + '/loading');
  }
);

if (process.env.TEST) {
  app.use((req, res, next) => {
    req.user = {_id: '5a63c29174d39b08342a59e2',
  fbid: 10211342727149288,
  displayname: 'Gabrielle Rivera',
  photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901',
  __v: 0 };
    next();
  });

  app.use('/event/join/*', (req, res, next) => {
    req.user = { _id: '5a63c29174d39b08342a5969',
      fbid: 10211342727149269,
      displayname: 'Cody Maverick',
      photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901',
      };
    next();
  });

  app.use('/event/leave/*', (req, res, next) => {
    req.user = { _id: '5a63c29174d39b08342a5420',
      fbid: 10211342727149420,
      displayname: 'Tank Evans',
      photo: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/15590502_10208201639144052_5928782208183143104_n.jpg?oh=07a9b95b86ef0d984b4f42928a4f2568&oe=5AEF5901',
      };
    next();
  });
}

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.BASE_URL + '/');
});

// Set up authentication
app.post('*', utils.requireAuthentication);
app.put('*', utils.requireAuthentication);
app.delete('*', utils.requireAuthentication);

// Set up our routes.
app.use('/greenspace', greenspace);
app.use('/review', review);
app.use('/event', event);
app.use('/user', user);

// Auto direct to homepage
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Open app on specified port (default 3000)
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});

// Export our app (so that tests and bin can find it)
module.exports = app;
