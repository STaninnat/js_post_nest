const express = require('express');
const router = express.Router();
const { respondWithJSON, respondWithError } = require('../respond-json');

function handlerUser(req, res) {
    
}

router.post('/signup', handlerUser);

module.exports = router
