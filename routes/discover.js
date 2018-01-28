const express = require('express');
const passport = require('./passport');
const utils = require('../utils');
const discover = require('../models/discover');

const router = express.Router();

// GET /discover/:userLocation (lat, lon)
  // Response body:
    // success: true if discover info retrieved from database; false otherwise
    // err: on error, an error message
router.get('/:userLocation', async (req, res) => {
  try {
    let userLocation = req.params.userLocation.split(',')
    userLocation = userLocation.map((val) => {
      return parseFloat(val);
    });
    const discoverData = await discover.getDiscoveryInfo(req.user.fbid, userLocation);
    utils.sendSuccessResponse(res, discoverData);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

module.exports = router;
