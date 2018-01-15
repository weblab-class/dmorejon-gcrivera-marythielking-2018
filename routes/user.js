const express = require('express');
const utils = require('../utils');

const router = express.Router();



router.get('/auth/facebook', async (req, res) => {
//
});

router.get('/logout', async (req, res) => {
//
});

// GET /user
// Response body:
// success: true if user info retrieved from database; false otherwise
// err: on error, an error message
// user: user object (see above schema)
router.get('/', async (req, res) => {
//
});

// PUT /user
// Request body:
// username
// email
// Response body:
// success: true if user info updated in database; false otherwise
// err: on error, an error message
// user: user object (see above schema)
router.put('/', async (req, res) => {
//
});

module.exports = router;
