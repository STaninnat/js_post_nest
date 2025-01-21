/**
 * Insert a new user key record into the database
 * @param {database} db - Database connection instance
 * @param {Object} user_key - Object containing user key details
 * @param {string} user_key.id - Unique identifier for the user key
 * @param {Date} user_key.createdAt - Timestamp of when the key was created
 * @param {Date} user_key.updatedAt - Timestamp of the last update to the key
 * @param {Date} user_key.accessTokenExpiresAt - Expiry timestamp for the access token
 * @param {string} user_key.refreshToken - Refresh token value
 * @param {Date} user_key.refreshTokenExpiresAt - Expiry timestamp for the refresh token
 * @param {string} user_key.userID - Identifier of the associated user
 * @returns {Promise<void>} - Resolves when the record is successfully inserted
 */
async function createUserRFKey(db, user_key) {
  const {
    id,
    createdAt,
    updatedAt,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    userID,
  } = user_key;

  await db("users_key").insert({
    id,
    created_at: createdAt,
    updated_at: updatedAt,
    access_token_expires_at: accessTokenExpiresAt,
    refresh_token: refreshToken,
    refresh_token_expires_at: refreshTokenExpiresAt,
    user_id: userID,
  });
}

/**
 * Update an existing user key record in the database
 * @param {database} db - Database connection instance
 * @param {Object} user_key - Object containing updated user key details
 * @param {Date} user_key.updatedAt - Timestamp of the last update to the key
 * @param {Date} user_key.accessTokenExpiresAt - Expiry timestamp for the access token
 * @param {string} user_key.refreshToken - Refresh token value
 * @param {Date} user_key.refreshTokenExpiresAt - Expiry timestamp for the refresh token
 * @param {string} user_key.userID - Identifier of the associated user
 * @returns {Promise<void>} - Resolves when the record is successfully updated
 */
async function updateUserRFKey(db, user_key) {
  const {
    updatedAt,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    userID,
  } = user_key;

  await db("users_key").where({ user_id: userID }).update({
    updated_at: updatedAt,
    access_token_expires_at: accessTokenExpiresAt,
    refresh_token: refreshToken,
    refresh_token_expires_at: refreshTokenExpiresAt,
  });
}

/**
 * Retrieve a user key record by user ID
 * @param {database} db - Database connection instance
 * @param {string} userID - Identifier of the user
 * @returns {Promise<Object|null>} - Resolves with the user key record or null if not found
 */
async function getRFKeyByUserID(db, userID) {
  return await db("users_key").where({ user_id: userID }).first();
}

/**
 * Retrieve a user record by refresh token
 * @param {database} db - Database connection instance
 * @param {string} refreshToken - Refresh token value
 * @returns {Promise<Object|null>} - Resolves with the user record or null if not found
 */
async function getUserByRFKey(db, refreshToken) {
  return await db("users_key").where({ refresh_token: refreshToken }).first();
}

module.exports = {
  createUserRFKey,
  updateUserRFKey,
  getRFKeyByUserID,
  getUserByRFKey,
};
