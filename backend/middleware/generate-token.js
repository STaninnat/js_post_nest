require("dotenv").config();
const dayjs = require("dayjs");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isValidUserName(username) {
  const usernameRegex = /^[a-zA-Z0-9]+([-._]?[a-zA-Z0-9]+)*$/;
  return (
    username.length >= 3 &&
    username.length <= 30 &&
    usernameRegex.test(username)
  );
}

async function hashAPIKey() {
  const apiKey = generateRandomSHA256HASH();
  const hashedApiKey = await bcrypt.hash(apiKey, 10);
  return { hashedApiKey };
}

function generateRandomSHA256HASH() {
  return crypto.randomBytes(32).toString("hex");
}

function generateJWTToken(payload, expiresAt, keyType) {
  let secret;

  if (keyType === "refreshToken") {
    secret = process.env.REFRESH_SECRET;
  } else {
    secret = process.env.JWT_SECRET;
  }

  if (!secret) {
    throw new Error("jwt or refresh secret is not defined");
  }

  const expiresIn = dayjs(expiresAt).diff(dayjs(), "second");

  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = {
  isValidUserName,
  hashAPIKey,
  generateRandomSHA256HASH,
  generateJWTToken,
};
