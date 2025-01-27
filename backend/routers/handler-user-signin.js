const dayjs = require("dayjs");
const bcrypt = require("bcrypt");
const { validate } = require("uuid");

const db = require("../database/knex-instance");
const queriesUsers = require("../database/helper/users");
const queriesUsersKey = require("../database/helper/users-key");
const {
  generateJWTToken,
  hashAPIKey,
} = require("../middleware/generate-token");
const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");

async function handlerUserSignin(req, res) {
  const { username, password, rememberMe } = req.body;

  if (!username || !password) {
    return respondWithError(res, 400, "invalid input");
  }

  try {
    const user = await queriesUsers.getUserByName(db, username);
    if (!user) {
      return respondWithError(res, 400, "username not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return respondWithError(res, 400, "incorrect password");
    }

    if (dayjs(user.apiKeyExpiresAt).isBefore(dayjs().toDate())) {
      return respondWithError(res, 401, "api key expired");
    }

    const userID = user.id;
    if (!validate(userID)) {
      return respondWithError(res, 500, "invalid user ID");
    }

    const { hashedApiKey } = await hashAPIKey();
    const apiKeyExpiresAt = dayjs().add(1, "day").toDate();

    await queriesUsers.updateUser(db, {
      id: userID,
      updatedAt: dayjs().toDate(),
      apiKey: hashedApiKey,
      apiKeyExpiresAt: apiKeyExpiresAt,
    });

    const jwtExpiresAt = rememberMe
      ? dayjs().add(30, "day").toDate()
      : dayjs().add(1, "hour").toDate();
    const jwtToken = generateJWTToken(
      { id: userID, api_key: user.api_key },
      jwtExpiresAt,
      "jwtToken"
    );

    const refreshTokenExpiresAt = rememberMe
      ? dayjs().add(30, "day").toDate()
      : dayjs().add(30, "day").toDate();
    const refreshToken = generateJWTToken(
      { id: userID, api_key: user.api_key },
      refreshTokenExpiresAt,
      "refreshToken"
    );

    await queriesUsersKey.updateUserRFKey(db, {
      updatedAt: dayjs().toDate(),
      accessTokenExpiresAt: jwtExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      userID,
    });

    res.cookie("access_token", jwtToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: jwtExpiresAt,
      sameSite: "strict",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: refreshTokenExpiresAt,
      sameSite: "strict",
    });

    return respondWithJSON(res, 200, { message: "Logged in successfully" });
  } catch (error) {
    console.error("error during logging in: ", error.message, error.stack);
    return respondWithError(res, 500, "error - logging in");
  }
}

module.exports = handlerUserSignin;
