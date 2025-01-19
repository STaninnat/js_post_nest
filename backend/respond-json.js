const express = require('express');

function respondWithError(res, status, message) {
    if (status > 499) {
        console.error(`responding with 5XX error: ${message}`);
    }

    const errorResponse = {
        error: message
    };

    respondWithJSON(res, status, errorResponse);
}

function respondWithJSON(res, status, payload) {
    try {
        res.status(status).json(payload);
    } catch (error) {
        console.error(`error serializing JSON: ${error.message}`);
        res.status(500).json({ error: "internal server error" });
    }
}

module.exports = { respondWithJSON, respondWithError };