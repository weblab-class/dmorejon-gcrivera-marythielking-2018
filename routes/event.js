const express = require('express');
const utils = require('../utils');
const event = require('../models/event');

const router = express.Router();

// GET /event/:eventid
  // Response Body:
    // success: true if event retrieved from the database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.get('/:eventid', async (req, res) => {
  try {
    event.getEvent(req.params.eventid);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 404, e.msg);
  }
});

// GET /event/greenspace/:greenspaceid
  // Response Body:
    // success: true if events retrieved from the database; false otherwise
    // err: on error, an error message
    // events: list of event objects (see above schema)
router.get('/greenspace/:greenspaceid', async (req, res) => {
  try {
    event.getEventsByGreenspace(req.params.greenspaceid);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 404, e.msg);
  }
});

// GET /event/user/
  // Response Body:
    // success: true if events retrieved from the database; false otherwise
    // err: on error, an error message
    // events: list of event objects (see above schema)
router.get('/user', async (req, res) => {
  try {
    event.getEventsByUser(req.user.fbid);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 404, e.msg);
  }
});

// POST /event
  // Request Body:
    // name
    // description
    // greenspace
    // starttime
    // endtime
    // participants (**[userid])
  // Response body:
    // success: true if event added to database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.post('/', async (req, res) => {

});

// PUT /event/:eventid
  // Request Body:
    // event: event object w/ updated information (see above schema)
  // Response Body:
    // success: true if event changed in database; false otherwise
    // err: on error, an error message
router.put('/:eventid', async (req, res) => {

});

// PUT /event/join/:eventid
  // Response body:
    // success: true if participant added to event in database; false otherwise
    // err: on error, an error message
    // event: event object (see schema)
router.put('/join/:eventid', async (req, res) => {

});

// PUT /event/leave/:eventid
  // Request Body:
    // target (user to leave event)
  // Response body:
    // success: true if participant removed from event in database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.put('/leave/:eventid', async (req, res) => {

});

// DELETE /event/:eventid
  // Response body:
    // success: true if event deleted from database; false otherwise
    // err: on error, an error message
router.delete('/:eventid', async (req, res) => {

});

module.exports = router;