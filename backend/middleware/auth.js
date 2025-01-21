const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const queriesUsers = require("../database/helper/users");
const { respondWithError } = require("./respond-json");

function middlewareAuth(db, jwtSecret) {
  return async (req, res, next) => {
    const token = req.cookies["access_token"];
    if (!token) {
      return respondWithError(res, 401, "couldn't find token");
    }

    try {
      const claims = jwt.verify(token, jwtSecret);
      if (!claims || !claims.id) {
        return respondWithError(res, 401, "invalid token claims");
      }

      const user = await queriesUsers.getUserByID(db, claims.id);
      if (!user) {
        return respondWithError(res, 500, "couldn't get user");
      }
      if (isApiKeyExpired(user)) {
        return respondWithError(res, 401, "api key expired");
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("token validation error: ", error);
      if (error.name === "TokenExpiredError") {
        return respondWithError(res, 401, "token expired");
      }
      return respondWithError(res, 401, "invalid token");
    }
  };
}

function isApiKeyExpired(user) {
  return dayjs(user.apiKeyExpiresAt).isBefore(dayjs().toDate());
}

module.exports = middlewareAuth;
