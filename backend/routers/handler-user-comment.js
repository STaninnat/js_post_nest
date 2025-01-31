const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const db = require("../database/knex-instance");
const queriesUsersComment = require("../database/helper/comments");
const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");

async function handlerCommentCreate(req, res) {
  const { postID, comment } = req.body;
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  if (!postID) {
    return respondWithError(res, 400, "cannot get post id");
  }

  try {
    const userComment = {
      id: uuidv4(),
      createdAt: dayjs.tz().toDate(),
      updatedAt: dayjs.tz().toDate(),
      comment,
      postID,
      userID: user.id,
    };

    await queriesUsersComment.createComment(db, userComment);

    return respondWithJSON(res, 200, {
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error(
      "error during comment creation: ",
      error.message,
      error.stack
    );
    return respondWithError(res, 500, "error - couldn't create comment");
  }
}

async function handlerCommentsGet(req, res) {
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  try {
    const comments = await queriesUsersComment.getComments(db);
    return respondWithJSON(res, 200, { comments });
  } catch (error) {
    console.error(
      "error during getting all comments: ",
      error.message,
      error.stack
    );
    return respondWithError(res, 500, "error - couldn't get all comments");
  }
}

async function handlerCommentsGetForPost(req, res) {
  const user = req.user;
  if (!user) {
    return respondWithError(res, 401, "user authorization is required");
  }

  const { postID } = req.query;

  try {
    const comments = await queriesUsersComment.getCommentsByPostID(db, postID);
    if (!comments || comments.length === 0) {
      return respondWithError(res, 400, "no comments found for this post");
    }

    return respondWithJSON(res, 200, { comments });
  } catch (error) {
    console.error(
      "error during getting post comments: ",
      error.message,
      error.stack
    );
    return respondWithError(res, 500, "error - couldn't get comments");
  }
}

module.exports = {
  handlerCommentCreate,
  handlerCommentsGet,
  handlerCommentsGetForPost,
};
