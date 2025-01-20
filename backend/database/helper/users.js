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

async function getUserByApiKey(db, apiKey) {
    return await db('users').where({ api_key: apiKey }).first();
}

async function getUserByName(db, username) {
    return await db('users').where({ username }).first();
}

async function getUserByID(db, id) {
    return await db('users').where({ id }).first();
}

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