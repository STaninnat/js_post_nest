async function createUserRFKey(db, user_key) {
    const { id, createdAt, updatedAt, accessTokenExpiresAt,
        refreshToken, refreshTokenExpiresAt, userID
     } = user_key;

     await db('users_key').insert({
        id,
        created_at: createdAt,
        updated_at: updatedAt,
        access_token_expires_at: accessTokenExpiresAt,
        refresh_token: refreshToken,
        refresh_token_expires_at: refreshTokenExpiresAt,
        user_id: userID
     });
}

async function updateUserRFKey(db, user_key) {
    const { updatedAt, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, userID } = user_key;

    await db('users_key')
        .where({ user_id: userID })
        .update({
            updated_at: updatedAt,
            access_token_expires_at: accessTokenExpiresAt,
            refresh_token: refreshToken,
            refresh_token_expires_at: refreshTokenExpiresAt
        });
}

async function getRFKeyByUserID(db, userID) {
    return await db('users_key').where({ user_id: userID }).first();
}

async function getUserByRFKey(db, refreshToken) {
    return await db('users_key').where({ refresh_token: refreshToken }).first();
}

module.exports = {
    createUserRFKey,
    updateUserRFKey,
    getRFKeyByUserID,
    getUserByRFKey
}