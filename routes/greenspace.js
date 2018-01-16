const express = require('express');
const utils = require('../utils');
const greenspace = require('../models/greenspace');

const router = express.Router();


// POST /greenspace
  // Request Body:
    // name
    // location
  // Response Body:
    // success: true if green space added to database; false otherwise
    // err: on error, an error message
    // greenspace: greenspace object (see schema)
router.post('/', async (req, res) => {
  try {
    const newGreenspace = await greenspace.createGreenspace(req.body.name, req.body.location);
    utils.sendSuccessResponse(res, newGreenspace);
  } catch(e) {
    utils.sendErrorResponse(res, e.code, e.msg);
  }
});

// DELETE /greenspace/:greenspaceid
  // Response Body:
    // success: true if green space deleted from database; false otherwise
    // err: on error, an error message
router.delete('/:greenspaceid', async (req, res) => {
  try {
    await greenspace.deleteGreenspace(req.params.greenspaceid);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, e.code, e.msg);
  }
});

// PUT /greenspace/name/:greenspaceid
  // Request Body:
    // name
  // Response Body:
    // success: true if green space name changed in database; false otherwise
    // err: on error, an error message
router.put('/name/:greenspaceid', async (req, res) => {
  try {
    await greenspace.changeGreenspaceName(req.params.greenspaceid, req.body.name);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, e.code, e.msg);
  }
});

// PUT /greenspace/location/:greenspaceid
  // Request Body:
    // location
  // Response body:
    // success: true if green space location changed in database; false otherwise
    // err: on error, an error message
router.put('/location/:greenspaceid', async (req, res) => {
  try {
    await greenspace.changeGreenspaceName(req.params.greenspaceid, req.body.location);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, e.code, e.msg);
  }
});

module.exports = router;
