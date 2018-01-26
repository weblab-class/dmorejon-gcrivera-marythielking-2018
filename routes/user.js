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
    if (req.user === undefined) {
      utils.sendSuccessResponse(res, null);
    } else {
      const userData = await user.getUser(req.user.fbid);
      utils.sendSuccessResponse(res, userData);
    }
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// GET /user/:name
  // Response body:
    // success: true if user info retrieved from database; false otherwise
    // err: on error, an error message
    // users: user objects (see above schema)
router.get('/:name', async (req, res) => {
  try {
    const userData = await user.getUsers(req.params.name);
    utils.sendSuccessResponse(res, userData);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// PUT /user/tag/create
  // Request Body:
    // name: name of tag to be added to current user
  // Response body:
    // success: true if user info retrieved from database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.put('/tag/create', async (req, res) => {
  try {
    const userData = await user.addTag(req.user.fbid, req.body.name);
    utils.sendSuccessResponse(res, userData);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// PUT /user/tag/delete
  // Request Body:
    // name: name of tag to be added to current user
  // Response body:
    // success: true if user info retrieved from database; false otherwise
    // err: on error, an error message
    // user: user object (see above schema)
router.put('/tag/delete', async (req, res) => {
  try {
    const userData = await user.deleteTag(req.user.fbid, req.body.name);
    utils.sendSuccessResponse(res, userData);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

module.exports = router;
