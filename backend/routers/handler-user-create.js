const dayjs = require("dayjs");
const bcrypt = require("bcrypt");
const { v4: uuidv4, validate } = require("uuid");

const db = require("../database/knex-instance");
const queriesUsers = require("../database/helper/users");
const queriesUsersKey = require("../database/helper/users-key");
const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");
const {
  isValidUserName,
  hashAPIKey,
  generateJWTToken,
} = require("../middleware/generate-token");

async function handlerUserCreate(req, res) {
  const { username, password, gender } = req.body;

  if (!username || !password) {
    return respondWithError(res, 400, "invalid input");
  }

  if (!isValidUserName(username)) {
    return respondWithError(res, 400, "invalid username format");
  }

  const existingUsername = await queriesUsers.getUserByName(db, username);
  if (existingUsername) {
    return respondWithError(res, 400, "username already exists");
  }

  if (password.length < 8) {
    return respondWithError(
      res,
      400,
      "password must be at least 8 characters long"
    );
  }

  const userGender = gender || null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { hashedApiKey } = await hashAPIKey();

    const apiKeyExpiresAt = dayjs.tz().add(30, "day").toDate();

    await queriesUsers.createUser(db, {
      id: uuidv4(),
      createdAt: dayjs.tz().toDate(),
      updatedAt: dayjs.tz().toDate(),
      username,
      password: hashedPassword,
      gender: userGender,
      apiKey: hashedApiKey,
      apiKeyExpiresAt,
    });

    const user = await queriesUsers.getUserByApiKey(db, hashedApiKey);
    if (!user) {
      return respondWithError(res, 404, "User not found");
    }

    const userID = user.id;
    if (!validate(userID)) {
      return respondWithError(res, 500, "invalid user ID");
    }

    const jwtExpiresAt = dayjs.tz().add(15, "minute").toDate();
    const jwtToken = generateJWTToken(
      { id: userID, api_key: hashedApiKey },
      jwtExpiresAt,
      "jwtToken"
    );

    const refreshTokenExpiresAt = dayjs.tz().add(30, "day").toDate();
    const refreshToken = generateJWTToken(
      { id: userID, api_key: hashedApiKey },
      refreshTokenExpiresAt,
      "refreshToken"
    );

    await queriesUsersKey.createUserRFKey(db, {
      id: uuidv4(),
      createdAt: dayjs.tz().toDate(),
      updatedAt: dayjs.tz().toDate(),
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

    return respondWithJSON(res, 201, { message: "User created successfully" });
  } catch (err) {
    console.error("error during user creation: ", err.message, err.stack);
    return respondWithError(res, 500, "error - creating user");
  }
}

async function handlerUserGet(req, res) {
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  try {
    const userParams = await queriesUsers.getUserByID(db, user.id);

    const userInfo = {
      id: userParams.id,
      createdAt: userParams.created_at,
      updatedAt: userParams.updated_at,
      username: userParams.username,
      gender: userParams.gender,
      apiKeyExpiresAt: userParams.api_key_expires_at,
    };

    return respondWithJSON(res, 200, { userInfo });
  } catch (error) {
    console.error("error during getting user: ", error.message, error.stack);
    return respondWithError(res, 500, "error - couldn't get user");
  }
}

module.exports = { handlerUserCreate, handlerUserGet };
