const express = require('express');
const utils = require('../utils');
const review = require('../models/review');
const router = express.Router();

// GET /review/greenspace/:greenspaceid
// Response Body:
    // success: true if reviews retrieved from the database; false otherwise
    // err: on error, an error message
    // reviews: list of review objects (see above schema)
    // rating: float, average rating for green space
router.get('/greenspace/:greenspaceid', async (req, res) => {
  try{
    await review.getReviewByGreenspace(req.body.greenspace);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 400, e.msg);
  }

});

// GET /review/user/
// Response Body:
    // success: true if reviews retrieved from the database; false otherwise
    // err: on error, an error message
    // reviews: list of review objects (see above schema)
router.get('/user', async (req, res) => {
  try{
    await review.getReviewByUser(req.user.fbid);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 400, e.msg);
  }

});

// POST /review
// Request Body:
    // greenspace
      // rating
      // body
      // time
// Response body:
    // success: true if review added to database; false otherwise
    // err: on error, an error message
    // review: review object (see schema)
router.post('/', async (req, res) => {
  try {
    await review.createReview(req.body.greenspace, req.body.rating, req.body.body,
                                req.body.time, req.user.fbid);
    utils.sendSuccessResponse(res);
  } catch(e) {
    utils.sendErrorResponse(res, 400, e.msg);
  }
});


// Delete /review
// Request Body:
    // greenspace
// Response body:
    // success: true if review deleted from database; false otherwise
    // err: on error, an error message
router.delete('/', async (req,rest) => {
 try {
   await review.deleteReview(req.body.greenspace, req.user.fbid);
   utils.sendSuccessResponse(res);
 } catch(e) {
   utils.sendErrorResponse(res, 400, e.msg);
 }
});

module.exports = router;
