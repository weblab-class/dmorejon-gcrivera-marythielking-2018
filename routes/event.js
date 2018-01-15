const express = require('express');
const utils = require('../utils');

const router = express.Router();

// GET /event/:eventid
  // Response Body:
    // success: true if event retrieved from the database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.get('/:eventid', async (res, req) => {

});

// GET /event/greenspace/:greenspaceid
  // Response Body:
    // success: true if events retrieved from the database; false otherwise
    // err: on error, an error message
    // events: list of event objects (see above schema)
router.get('/greenspace/:greenspaceid', async (res, req) => {

});

// GET /event/user/
  // Response Body:
    // success: true if events retrieved from the database; false otherwise
    // err: on error, an error message
    // events: list of event objects (see above schema)
router.get('/user', async (res, req) => {

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
router.post('/', async (res, req) => {

});

// PUT /event/:eventid
  // Request Body:
    // event: event object w/ updated information (see above schema)
  // Response Body:
    // success: true if event changed in database; false otherwise
    // err: on error, an error message
router.put('/:eventid', async (res, req) => {

});

// PUT /event/join/:eventid
  // Response body:
    // success: true if participant added to event in database; false otherwise
    // err: on error, an error message
    // event: event object (see schema)
router.put('/join/:eventid', async (res, req) => {

});

// PUT /event/leave/:eventid
  // Request Body:
    // target (user to leave event)
  // Response body:
    // success: true if participant removed from event in database; false otherwise
    // err: on error, an error message
    // event: event object (see above schema)
router.put('/leave/:eventid', async (res, req) => {

});

// DELETE /event/:eventid
  // Response body:
    // success: true if event deleted from database; false otherwise
    // err: on error, an error message
router.delete('/:eventid', async (res, req) => {

});

module.exports = router;