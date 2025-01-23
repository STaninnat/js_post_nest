const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");

function handlerReadiness(req, res) {
  respondWithJSON(res, 200, { status: "ok" });
}

function handlerError(req, res) {
  respondWithError(res, 500, "Internal Server Error");
}

module.exports = { handlerReadiness, handlerError };
