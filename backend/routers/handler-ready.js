const express = require('express');
const router = express.Router();
const { respondWithJSON, respondWithError } = require('../respond-json');

function handlerReadiness(req, res) {
    respondWithJSON(res, 200, { status: "ok" });
}

function handlerError(req, res) {
    respondWithError(res, 500, "Internal Server Error");
}

router.get('/readiness', handlerReadiness);
router.get('/error', handlerError);

module.exports = router;