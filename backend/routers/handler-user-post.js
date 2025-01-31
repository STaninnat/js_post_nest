const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const db = require("../database/knex-instance");
const queriesUsersPost = require("../database/helper/posts");
const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");

async function handlerPostCreate(req, res) {
  const { post } = req.body;
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  if (!post || post.trim() === "") {
    return respondWithError(res, 400, "post content cannot be empty");
  }

  try {
    const userPost = {
      id: uuidv4(),
      createdAt: dayjs.tz().toDate(),
      updatedAt: dayjs.tz().toDate(),
      post,
      userID: user.id,
    };

    await queriesUsersPost.createPost(db, userPost);

    return respondWithJSON(res, 201, { message: "Post created successfully" });
  } catch (error) {
    console.error("error during post creation: ", error.message, error.stack);
    return respondWithError(res, 500, "error - couldn't create post");
  }
}

async function handlerPostsGet(req, res) {
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  try {
    const posts = await queriesUsersPost.getAllPosts(db);

    return respondWithJSON(res, 200, { posts });
  } catch (error) {
    console.error(
      "error during getting all posts: ",
      error.message,
      error.stack
    );
    return respondWithError(res, 500, "error - couldn't get all posts");
  }
}

async function handlerPostsGetForUser(req, res) {
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  try {
    const posts = await queriesUsersPost.getPostsByUserID(db, user.id);
    // if (!posts || posts.length === 0) {
    //   return respondWithError(res, 400, "no posts found for this user");
    // }

    return respondWithJSON(res, 200, { posts });
  } catch (error) {
    console.error(
      "error during getting user posts: ",
      error.message,
      error.stack
    );
    return respondWithError(res, 500, "error - couldn't get post");
  }
}

async function handlerPostsEdit(req, res) {
  const { post, postID } = req.body;
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }
  if (!postID) {
    return respondWithError(res, 400, "postID is required");
  }

  try {
    const userPost = await queriesUsersPost.getPostByID(db, postID);
    if (!userPost || userPost.user_id !== user.id) {
      return respondWithError(
        res,
        404,
        "post not found or does not belong to the user"
      );
    }
    await queriesUsersPost.updatePost(db, postID, {
      post,
      updatedAt: dayjs.tz().toDate(),
    });

    return respondWithJSON(res, 200, { message: "Post updated successfully" });
  } catch (error) {
    console.error("error during editting post: ", error.message, error.stack);
    return respondWithError(res, 500, "error - couldn't edit post");
  }
}

async function handlerPostsDelete(req, res) {
  const { postID } = req.body;
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }
  if (!postID) {
    return respondWithError(res, 400, "postID is required");
  }

  try {
    const userPost = await queriesUsersPost.getPostByID(db, postID);
    if (!userPost || userPost.user_id !== user.id) {
      return respondWithError(
        res,
        404,
        "post not found or does not belong to the user"
      );
    }

    await queriesUsersPost.deletePost(db, postID);
    return respondWithJSON(res, 200, { message: "Post deleted successfully" });
  } catch (error) {
    console.error("error during delete post: ", error.message, error.stack);
    return respondWithError(res, 500, "error - couldn't delete post");
  }
}

module.exports = {
  handlerPostCreate,
  handlerPostsGet,
  handlerPostsGetForUser,
  handlerPostsEdit,
  handlerPostsDelete,
};
