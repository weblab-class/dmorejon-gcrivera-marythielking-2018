const express = require('express');
const passport = require('./passport');
const utils = require('../utils');

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

// PUT /user
  // Request body:
    // username
    // email
  // Response body:
    // success: true if user info updated in database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.put('/', async (req, res) => {
  try{
    const updatedUser = await user.updateUser(req.user.fbid,
                                              req.body.username,
                                              req.body.email);
    utils.sendSuccessResponse(res, updatedUser);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

module.exports = router;
