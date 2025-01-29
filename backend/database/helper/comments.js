/**
 * Insert a new comment record into the database
 * @param {database} db - Database connection instance
 * @param {Object} userComment - Object containing user comment details
 * @param {Date} userComment.createdAt - Timestamp of when the comment was created
 * @param {Date} userComment.updatedAt - Timestamp of the last update to the comment
 * @param {string} userComment.comment - The content of the comment
 * @param {string} userComment.postID - Identifier of the associated post
 * @param {string} userComment.userID - Identifier of the user who made the comment
 * @returns {Promise<void>} - Resolves when the record is successfully inserted
 */
async function createComment(db, userComment) {
  const { id, createdAt, updatedAt, comment, postID, userID } = userComment;

  await db("comments").insert({
    id,
    created_at: createdAt,
    updated_at: updatedAt,
    comment,
    post_id: postID,
    user_id: userID,
  });
}

/**
 * Retrieve a list of comments with associated user information
 * @param {database} db - Database connection instance
 * @returns {Promise<Array>} - Resolves with an array of comment objects
 */
async function getComments(db) {
  return await db("comments")
    .join("users", "comments.user_id", "=", "users.id")
    .select(
      "comments.id",
      "comments.created_at",
      "comments.updated_at",
      "comments.comment",
      "comments.post_id",
      "users.username"
    )
    .orderBy("comments.created_at", "desc");
}

module.exports = { createComment, getComments };
