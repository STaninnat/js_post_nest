/**
 * Send an error response with a specific status code and message
 * @param {Object} res - Response object of Express
 * @param {number} status - HTTP status code
 * @param {Object} message - Error message to include in the response
 */
function respondWithError(res, status, message) {
    if (status > 499) {
        console.error(`responding with 5XX error: ${message}`);
    }

    const errorResponse = {
        error: message
    };

    respondWithJSON(res, status, errorResponse);
}

/**
 * Send JSON response with status code
 * @param {Object} res - Response object of Express
 * @param {number} status - HTTP status code
 * @param {Object} payload - Data to include in the JSON response
 */
function respondWithJSON(res, status, payload) {
    try {
        res.status(status).json(payload);
    } catch (error) {
        console.error(`error serializing JSON: ${error.message}`);
        res.status(500).json({ error: "internal server error" });
    }
}

module.exports = { respondWithJSON, respondWithError };