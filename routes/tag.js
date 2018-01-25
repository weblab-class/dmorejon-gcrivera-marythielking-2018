const express = require('express');
const passport = require('./passport');
const utils = require('../utils');
const tag = require('../models/tag');

const tag = express.Router();


// GET /tag/:name
  // Response body:
    // success: true if tag info retrieved from database; false otherwise
    // err: on error, an error message
    // tags: tag objects matching name (see above schema)
router.get('/:name', async (req, res) => {
  try {
    const tags = await tag.getTags(req.params.name);
    utils.sendSuccessResponse(res, tags);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// POST /tag
  // Request Body:
    // name
  // Response body:
    // success: true if tag names added to database; false otherwise
    // err: on error, an error message
    // tag: tag object (see above schema)
router.post('/', async (req, res) => {
  try {
    const tagData = await tag.createTag(req.body.name);
    utils.sendSuccessResponse(res, tagData);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

// DELETE /tag/:name
  // Response Body:
    // success: true if tag deleted from database; false otherwise
    // err: on error, an error message
router.delete('/:name', async (req, res) => {
  try {
    await tag.deleteTag(req.params.name);
    utils.sendSuccessResponse(res, null);
  } catch(e) {
    utils.sendErrorResponse(res, e.errorCode, e.message);
  }
});

module.exports = router;