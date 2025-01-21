require('dotenv').config({ path: '../.env' });
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4, validate  } = require('uuid');
const db = require('../database/knex-instance');
const queriesUsers = require('../database/helper/users');
const queriesUsersKey = require('../database/helper/users_key');
const { respondWithJSON, respondWithError } = require('../respond-json');

const router = express.Router();

async function handlerUserCreate(req, res) {
    const { username, password, gender } = req.body;

    if (!username || !password) {
        return respondWithError(res, 400, "invalid input")
    }

    if (!isValidUserName(username)) {
        return respondWithError(res, 400, "invalid username format")
    }

    const existingUsername = await queriesUsers.getUserByName(db, username);
    if (existingUsername) {
        return respondWithError(res, 400, "username already exists");
    }

    if (password.length < 8) {
        return respondWithError(res, 400, "password must be at least 8 characters long");
    }

    const userGender = gender || null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { apiKey, hashedApiKey } = await hashAPIKey();

        const apiKeyExpiresAt = dayjs().add(30, 'day').toDate();

        await queriesUsers.createUser(db, {
            id: uuidv4(),
            createdAt: dayjs().toDate(),
            updatedAt: dayjs().toDate(),
            username,
            password: hashedPassword,
            gender: userGender,
            apiKey: hashedApiKey,
            apiKeyExpiresAt
        });

        const user = await queriesUsers.getUserByApiKey(db, hashedApiKey);
        if (!user) {
            return respondWithError(res, 404, "User not found");
        }

        const userIDString = user.id;
        if (!validate(userIDString)) {
            throw new Error('Invalid UUID format');
        }
 
        const jwtExpiresAt = dayjs().add(15, 'minute').toDate();
        const jwtToken = generateJWTToken({ id: userIDString, apiKey: hashAPIKey }, jwtExpiresAt, 'jwtToken');

        const refreshTokenExpiresAt = dayjs().add(30, 'day').toDate();
        const refreshToken = generateJWTToken({ id: userIDString, apiKey: hashAPIKey }, refreshTokenExpiresAt, 'refreshToken');

        await queriesUsersKey.createUserRFKey(db, {
            id: uuidv4(),
            createdAt: dayjs().toDate(),
            updatedAt: dayjs().toDate(),
            accessTokenExpiresAt: jwtExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            userID: userIDString
        });

        res.cookie('access_token', jwtToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            expires: jwtExpiresAt,
            sameSite: 'strict'
        });

        res.cookie('refresh_token', refreshToken, { 
            httpOnly: true, 
            secure: true,
            path: '/',
            expires: refreshTokenExpiresAt,
            sameSite: 'strict'
        });

        return respondWithJSON(res, 201, { message: "User created successfully" });
    } catch (err) {
        console.error("error during user creation: ", err.message, err.stack);
        return respondWithError(res, 500, "error createing user");
    }
}

function isValidUserName(username) {
    const usernameRegex = /^[a-zA-Z0-9]+([-._]?[a-zA-Z0-9]+)*$/;
    return username.length >= 3 && username.length <= 30 && usernameRegex.test(username);
}

async function hashAPIKey() {
    const apiKey = generateRandomSHA256HASH();
    const hashedApiKey = await bcrypt.hash(apiKey, 10);
    return { apiKey, hashedApiKey };
}

function generateRandomSHA256HASH() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
}

function generateJWTToken(payload, expiresAt, keyType) {
    let secret;

    if (keyType === 'refreshToken') {
        secret = process.env.REFRESH_SECRET;
    } else {
        secret = process.env.JWT_SECRET;
    }

    if (!secret) {
        throw new Error('jwt or refresh secret is not defined');
    }

    const expiresIn = dayjs(expiresAt).diff(dayjs(), 'second');

    return jwt.sign(payload, secret, { expiresIn });
}

router.post('/signup', handlerUserCreate);

module.exports = router
