const dayjs = require("dayjs");
const express = require("express");

const db = require("../database/knex-instance");
const queriesUsers = require("../database/helper/users");
const queriesUsersKey = require("../database/helper/users-key");
const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");
const {
  generateJWTToken,
  hashAPIKey,
} = require("../middleware/generate-token");

const router = express.Router();

async function handlerRefreshKey(req, res) {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return respondWithError(res, 401, "couldn't find refresh token");
    }

    const user = await queriesUsersKey.getUserByRFKey(db, refreshToken);
    if (
      !user ||
      dayjs(user.refresh_token_expires_at).isBefore(dayjs().toDate())
    ) {
      return respondWithError(res, 401, "invalid or expired refresh token");
    }

    const { hashedApiKey: newHashedApiKey } = await hashAPIKey();
    const newApiKeyExpiresAt = dayjs().add(1, "year").toDate();

    const newJwtTokenExpiresAt = dayjs().add(1, "hour").toDate();
    const newJwtToken = generateJWTToken(
      { id: user.user_id, api_key: newHashedApiKey },
      newJwtTokenExpiresAt,
      "jwtToken"
    );

    await queriesUsers.updateUser(db, {
      id: user.user_id,
      updatedAt: dayjs().toDate(),
      apiKey: newHashedApiKey,
      apiKeyExpiresAt: newApiKeyExpiresAt,
    });

    const newRefreshTokenExpiresAt = dayjs().add(30, "day").toDate();
    await queriesUsersKey.updateUserRFKey(db, {
      updatedAt: dayjs().toDate(),
      accessTokenExpiresAt: newJwtTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt: newRefreshTokenExpiresAt,
      userID: user.user_id,
    });

    res.cookie("access_token", newJwtToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: newJwtTokenExpiresAt,
      sameSite: "strict",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: newRefreshTokenExpiresAt,
      sameSite: "strict",
    });

    return respondWithJSON(res, 200, {
      message: "token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error.message, error.stack);
    return respondWithError(res, 500, "error refreshing token");
  }
}

router.post("/refresh-key", handlerRefreshKey);

module.exports = router;
