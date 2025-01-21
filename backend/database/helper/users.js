/**
 * Insert a new user record into the database
 * @param {database} db - Database connection instance
 * @param {Object} user - Object containing user details
 * @param {string} user.id - Unique identifier for the user
 * @param {Date} user.createdAt - Timestamp of when the user was created
 * @param {Date} user.updatedAt - Timestamp of the last update to the user record
 * @param {string} user.username - Username of the user
 * @param {string} user.password - Encrypted password of the user
 * @param {string} user.gender - Gender of the user
 * @param {string} user.apiKey - API key associated with the user
 * @param {Date} user.apiKeyExpiresAt - Expiry timestamp for the API key
 * @returns {Promise<void>} - Resolves when the record is successfully inserted
 */
async function createUser(db, user) {
    const { id, createdAt, updatedAt, username,
        password, gender, apiKey, apiKeyExpiresAt
     } = user;

    await db('users').insert({
        id,
        created_at: createdAt,
        updated_at: updatedAt,
        username,
        password,
        gender,
        api_key: apiKey,
        api_key_expires_at: apiKeyExpiresAt
    });
}

/**
 * Retrieve a user record by API key
 * @param {database} db - Database connection instance
 * @param {string} apiKey - API key associated with the user
 * @returns {Promise<Object|null>} - Resolves with the user record or null if not found
 */
async function getUserByApiKey(db, apiKey) {
    return await db('users').where({ api_key: apiKey }).first();
}

/**
 * Retrieve a user record by username
 * @param {database} db - Database connection instance
 * @param {string} username - Username of the user
 * @returns {Promise<Object|null>} - Resolves with the user record or null if not found
 */
async function getUserByName(db, username) {
    return await db('users').where({ username }).first();
}

/**
 * Retrieve a user record by user ID
 * @param {database} db - Database connection instance
 * @param {string} id - Unique identifier for the user
 * @returns {Promise<Object|null>} - Resolves with the user record or null if not found
 */
async function getUserByID(db, id) {
    return await db('users').where({ id }).first();
}

/**
 * Update an existing user record in the database
 * @param {database} db - Database connection instance
 * @param {Object} user - Object containing updated user details
 * @param {string} user.id - Unique identifier for the user
 * @param {Date} user.updatedAt - Timestamp of the last update to the user record
 * @param {string} user.apiKey - New API key associated with the user
 * @param {Date} user.apiKeyExpiresAt - Expiry timestamp for the new API key
 * @returns {Promise<void>} - Resolves when the record is successfully updated
 */
async function updateUser(db, user) {
    const { id, updatedAt, apiKey, apiKeyExpiresAt } = user;
    await db('users')
        .where({ id })
        .update({ 
            updated_at: updatedAt,
            api_key: apiKey,
            api_key_expires_at: apiKeyExpiresAt
        });
}

module.exports = { 
    createUser,
    getUserByApiKey,
    getUserByName,
    getUserByID,
    updateUser
}