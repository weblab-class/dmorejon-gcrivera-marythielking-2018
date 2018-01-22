const express = require('express');
const utils = require('../utils');
const event = require('../models/event');

const router = express.Router();

// GET /event/user/
  // Response Body:
    // success: true if events retrieved from the database; false otherwise
    // err: on error, an error message
    // events: list of event objects (see above schema)
router.get('/user', async (req, res) => {
  try {
    const events = await event.getEventsByUser(req.user.fbid);
    utils.sendSuccessResponse(res, events);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// GET /event/:eventid
  // Response Body:
    // success: true if event retrieved from the database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.get('/:eventid', async (req, res) => {
  try {
    const eventObj = await event.getEvent(req.params.eventid);
    utils.sendSuccessResponse(res, eventObj);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// GET /event/greenspace/:greenspaceid
  // Response Body:
    // success: true if events retrieved from the database; false otherwise
    // err: on error, an error message
    // events: list of event objects (see above schema)
router.get('/greenspace/:greenspaceid', async (req, res) => {
  try {
    const events = await event.getEventsByGreenspace(req.params.greenspaceid);
    utils.sendSuccessResponse(res, events);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
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
  try {
    const newEvent = await event.createEvent(req.body, req.user);
    utils.sendSuccessResponse(res, newEvent);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// PUT /event/:eventid
  // Request Body:
    // event: event object w/ updated information (see above schema)
  // Response Body:
    // success: true if event changed in database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.put('/:eventid', async (req, res) => {
  try {
    const edittedEvent = await event.editEvent(req.params.eventid,
                                                req.body,
                                                req.user.fbid);
    utils.sendSuccessResponse(res, edittedEvent);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// PUT /event/join/:eventid
  // Response body:
    // success: true if participant added to event in database; false otherwise
    // err: on error, an error message
    // event: event object (see schema)
router.put('/join/:eventid', async (req, res) => {
  try {
    const edditedEvent = await event.joinEvent(req.params.eventid, req.user.fbid);
    utils.sendSuccessResponse(res, edditedEvent);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// PUT /event/leave/:eventid
  // Request Body:
    // target (user to leave event)
  // Response body:
    // success: true if participant removed from event in database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.put('/leave/:eventid', async (req, res) => {
  try {
    const edditedEvent = await event.leaveEvent(req.params.eventid, req.user.fbid, req.body.target);
    utils.sendSuccessResponse(res, edditedEvent);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// DELETE /event/:eventid
  // Response body:
    // success: true if event deleted from database; false otherwise
    // err: on error, an error message
router.delete('/:eventid', async (req, res) => {
  try {
    await event.deleteEvent(req.params.eventid, req.user.fbid);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

module.exports = router;
