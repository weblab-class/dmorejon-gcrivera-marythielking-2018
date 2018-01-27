const express = require('express');
const utils = require('../utils');
const greenspace = require('../models/greenspace').greenspace;

const router = express.Router();


// GET /greenspace/:greenspaceid
  // Response Body:
    // success: true if green space added to database; false otherwise
    // err: on error, an error message
    // greenspace: greenspace object (see schema)
router.get('/:greenspaceid', async (req, res) => {
  try {
    const greenspaceData = await greenspace.getGreenspace(req.params.greenspaceid);
    utils.sendSuccessResponse(res, greenspaceData);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// GET /greenspace/:minLong/:maxLong/:minLat/:maxLat
  // Response Body:
    // success: true if green space added to database; false otherwise
    // err: on error, an error message
    // greenspaces: list of greenspace objects (see schema)
router.get('/:minLat/:maxLat/:minLong/:maxLong', async (req, res) => {
  try {
    const greenspaces = await greenspace.getGreenspaces(parseFloat(req.params.minLat),
                                                        parseFloat(req.params.maxLat),
                                                        parseFloat(req.params.minLong),
                                                        parseFloat(req.params.maxLong));
    utils.sendSuccessResponse(res, greenspaces);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// POST /greenspace
  // Request Body:
    // name
    // location
    // tags
  // Response Body:
    // success: true if green space added to database; false otherwise
    // err: on error, an error message
    // greenspace: greenspace object (see schema)
router.post('/', async (req, res) => {
  try {
    const newGreenspace = await greenspace.createGreenspace(req.body.name, req.body.location, req.body.tags);
    utils.sendSuccessResponse(res, newGreenspace);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
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
    utils.sendErrorResponse(res, e.errorCode, e.message);
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
    utils.sendErrorResponse(res, e.errorCode, e.message);
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
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

module.exports = router;
