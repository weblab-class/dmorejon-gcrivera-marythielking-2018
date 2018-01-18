const express = require('express');
const passport = require('./passport');
const utils = require('../utils');
const user = require('../models/user').user;

const router = express.Router();

// GET /user
  // Response body:
    // success: true if user info retrieved from database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.get('/', async (req, res) => {
  try {
    const userData = await user.getUser(req.user.fbid);
    utils.sendSuccessResponse(res, userData);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

module.exports = router;
