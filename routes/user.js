const express = require('express');
const passport = require('./passport');
const utils = require('../utils');

const router = express.Router();

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    { failureRedirect: '/' }
  ),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// GET /user
  // Response body:
    // success: true if user info retrieved from database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.get('/', async (req, res) => {
//
});

// PUT /user
  // Request body:
    // username
    // email
  // Response body:
    // success: true if user info updated in database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.put('/', async (req, res) => {
//
});

module.exports = router;
