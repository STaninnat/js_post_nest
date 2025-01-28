const dayjs = require("dayjs");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const db = require("../database/knex-instance");
const queriesUsers = require("../database/helper/users");
const queriesUsersKey = require("../database/helper/users-key");
const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");

const router = express.Router();

async function handlerLogout(req, res) {
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  try {
    const newKeyExpiredAt = dayjs.tz().subtract(1, "year").toDate();
    const newExpiredKey = "expired-" + uuidv4().slice(0, 28);

    await queriesUsers.updateUser(db, {
      id: user.id,
      updatedAt: dayjs.tz().toDate(),
      apiKey: newExpiredKey,
      apiKeyExpiresAt: newKeyExpiredAt,
    });

    await queriesUsersKey.updateUserRFKey(db, {
      updatedAt: dayjs.tz().toDate(),
      accessTokenExpiresAt: newKeyExpiredAt,
      refreshToken: newExpiredKey,
      refreshTokenExpiresAt: newKeyExpiredAt,
      userID: user.id,
    });

    res.cookie("access_token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: newKeyExpiredAt,
      maxAge: -1,
      sameSite: "strict",
    });

    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: newKeyExpiredAt,
      maxAge: -1,
      sameSite: "strict",
    });

    return respondWithJSON(res, 200, { message: "Logged out successfully" });
  } catch (error) {
    console.error("error during logout: ", error.message, error.stack);
    return respondWithError(res, 500, "error - couldn't logout");
  }
}

router.post("/signout", handlerLogout);

module.exports = router;
