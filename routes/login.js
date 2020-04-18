const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = {
    "secret": process.env.JWT_SECRET,
};

router.post('/login', async (req, res) => {

});

module.exports = router;