const dayjs = require("dayjs");

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

async function handlerRefreshKey(req, res) {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return respondWithError(res, 401, "couldn't find refresh token");
    }

    const user = await queriesUsersKey.getUserByRFKey(db, refreshToken);
    if (
      !user ||
      dayjs.tz(user.refresh_token_expires_at).isBefore(dayjs.tz().toDate())
    ) {
      return respondWithError(res, 401, "invalid or expired refresh token");
    }

    const { hashedApiKey: newHashedApiKey } = await hashAPIKey();
    const newApiKeyExpiresAt = dayjs.tz().add(3, "month").toDate();

    await queriesUsers.updateUser(db, {
      id: user.user_id,
      updatedAt: dayjs.tz().toDate(),
      apiKey: newHashedApiKey,
      apiKeyExpiresAt: newApiKeyExpiresAt,
    });

    const newJwtTokenExpiresAt = dayjs.tz().add(1, "hour").toDate();
    const newJwtToken = generateJWTToken(
      { id: user.user_id, api_key: newHashedApiKey },
      newJwtTokenExpiresAt,
      "jwtToken"
    );

    let newRefreshToken = refreshToken;
    const newRefreshTokenExpiresAt = dayjs.tz().add(30, "day").toDate();
    if (
      typeof refreshToken === "string" &&
      newRefreshToken.startsWith("expired-")
    ) {
      newRefreshToken = generateJWTToken(
        { id: user.user_id, api_key: newHashedApiKey },
        newRefreshTokenExpiresAt,
        "refreshToken"
      );
    }

    await queriesUsersKey.updateUserRFKey(db, {
      updatedAt: dayjs.tz().toDate(),
      accessTokenExpiresAt: newJwtTokenExpiresAt,
      refreshToken: newRefreshToken,
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

    res.cookie("refresh_token", newRefreshToken, {
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
    console.error("error during refresh token: ", error.message, error.stack);
    return respondWithError(res, 500, "error - refreshing token");
  }
}

module.exports = handlerRefreshKey;
