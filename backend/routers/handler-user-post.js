const dayjs = require("dayjs");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const db = require("../database/knex-instance");
const queriesUsersPost = require("../database/helper/posts");
const {
  respondWithJSON,
  respondWithError,
} = require("../middleware/respond-json");

const router = express.Router();

async function handlerPostCreate(req, res) {
  const { post } = req.body;
  const user = req.user;
  if (!user) {
    return respondWithError(res, 400, "cannot find user");
  }
  console.log("user: ", user);

  if (!post || post.trim() === "") {
    return respondWithError(res, 400, "post content cannot be empty");
  }

  try {
    const userPost = {
      id: uuidv4(),
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
      post,
      userID: user.id,
    };

    await queriesUsersPost.createPost(db, userPost);

    return respondWithJSON(res, 201, { message: "Post created successfully" });
  } catch (error) {
    console.error("error during post creation: ", error.message, error.stack);
    respondWithError(res, 500, "error creating post");
  }
}

router.post("/posts", handlerPostCreate);

module.exports = router;
