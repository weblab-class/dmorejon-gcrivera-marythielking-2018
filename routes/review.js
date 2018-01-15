const express = require('express');
const utils = require('../utils');

const router = express.Router();

// GET /review/greenspace/:greenspaceid
// Response Body:
// success: true if reviews retrieved from the database; false otherwise
// err: on error, an error message
// reviews: list of review objects (see above schema)
// rating: float, average rating for green space
router.get('/greenspace/:greenspaceid', async (req, res) => {
//
});

// GET /review/user/
// Response Body:
// success: true if reviews retrieved from the database; false otherwise
// err: on error, an error message
// reviews: list of review objects (see above schema)
router.get('/user', async (req, res) => {
//

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
//
});


// Delete /review
// Request Body:
// greenspace
// Response body:
// success: true if review deleted from database; false otherwise
// err: on error, an error message
router.delete('/', async (req,rest) => {
//
});

module.exports = router;
