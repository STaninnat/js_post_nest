/**
 * Insert a new post record into the database
 * @param {database} db - Database connection instance
 * @param {Object} userPost - Object containing user post details
 * @param {Date} userPost.createdAt - Timestamp of when the post was created
 * @param {Date} userPost.updatedAt - Timestamp of the last update to the post
 * @param {string} userPost.post - post of the user
 * @param {string} userPost.userID - Identifier of the associated user
 * @returns {Promise<void>} - Resolves when the record is successfully inserted
 */
async function createPost(db, userPost) {
  const { id, createdAt, updatedAt, post, userID } = userPost;

  await db("posts").insert({
    id,
    created_at: createdAt,
    updated_at: updatedAt,
    post,
    user_id: userID,
  });
}

/**
 * Retrieve a post record by post ID
 * @param {database} db - Database connection instance
 * @param {string} id - Unique identifier for the post
 * @returns {Promise<Object|null>} - Resolves with the user record or null if not found
 */
async function getPostByID(db, id) {
  return await db("posts").where({ id }).first();
}

/**
 * Retrieve a post record by user ID
 * @param {database} db - Database connection instance
 * @param {string} userID - Identifier of the user
 * @returns {Promise<Object|null>} - Resolves with the user key record or null if not found
 */
async function getPostsByUserID(db, userID) {
  return await db("posts")
    .where({ user_id: userID })
    .orderBy("created_at", "desc");
}

/**
 * Retrieve all posts, including the username of the author, ordered by creation timestamp (latest post first)
 * @param {database} db - Database connection instance
 * @returns {Promise<Array>} - Resolves with an array of posts, each including the author's username, sorted by created_at in descending order
 */
async function getAllPosts(db) {
  return await db("posts")
    .join("users", "posts.user_id", "=", "users.id")
    .select(
      "posts.id",
      "posts.created_at",
      "posts.updated_at",
      "posts.post",
      "users.username"
    )
    .orderBy("created_at", "desc");
}

/**
 * Delete a post by its ID
 * @param {database} db - Database connection instance
 * @param {string} id - Unique identifier for the post
 * @returns {Promise<void>} - Resolves when the post is successfully deleted
 */
async function deletePost(db, id) {
  await db("posts").where({ id }).del();
}

/**
 * Update a post by its ID
 * @param {database} db - Database connection instance
 * @param {string} id - Unique identifier for the post
 * @param {Object} updatedPost - Object containing the fields to update
 * @param {string} updatedPost.post - The updated post content
 * @param {Date} updatedPost.updatedAt - The updated timestamp for the post
 * @returns {Promise<void>} - Resolves when the post is successfully updated
 */
async function updatePost(db, id, updatedPost) {
  const { post, updatedAt } = updatedPost;

  await db("posts").where({ id }).update({
    post,
    updated_at: updatedAt,
  });
}

module.exports = {
  createPost,
  getPostByID,
  getPostsByUserID,
  getAllPosts,
  deletePost,
  updatePost,
};
