require("dotenv").config({ path: "./.env.test" });
const dayjs = require("dayjs");

const { setupDb, teardownDb } = require("../dbSetup");
const queriesUsers = require("../database/helper/users");
const queriesUsersPost = require("../database/helper/posts");
const queriesUsersComment = require("../database/helper/comments");

let db;
beforeAll(async () => {
  db = await setupDb();
});

afterEach(async () => {
  await db("comments").delete();
  await db("posts").delete();
  await db("users").delete();
});

afterAll(async () => {
  await teardownDb();
});

describe("Comments Database Functions", () => {
  const testUser = {
    id: "usertest1",
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    username: "testuser1",
    password: "testpassword1",
    gender: "male",
    apiKey: "test_api_key",
    apiKeyExpiresAt: dayjs().add(30, "day").toDate(),
  };

  const testUserPost = {
    id: "userposttest1",
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    post: "testpost1",
    userID: "usertest1",
  };

  const testComment = {
    id: "commenttest1",
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    comment: "testcomment1",
    postID: "userposttest1",
    userID: "usertest1",
  };

  beforeEach(async () => {
    await queriesUsers.createUser(db, testUser);
    await queriesUsersPost.createPost(db, testUserPost);
    await queriesUsersComment.createComment(db, testComment);
  });

  it("should create a comment", async () => {
    const comment = await db("comments").where({ id: testComment.id }).first();

    expect(comment).toBeDefined();
    expect(comment.comment).toBe("testcomment1");
    expect(comment.post_id).toBe("userposttest1");
    expect(comment.user_id).toBe("usertest1");
  });

  it("should get all comments", async () => {
    const comments = await queriesUsersComment.getComments(db);

    expect(comments).toHaveLength(1);
    expect(comments[0].comment).toBe("testcomment1");
    expect(comments[0].post_id).toBe("userposttest1");
    expect(comments[0].username).toBe("testuser1");
  });

  it("should get comments by postID", async () => {
    const comments = await queriesUsersComment.getCommentsByPostID(
      db,
      testComment.postID
    );

    expect(comments).toHaveLength(1);
    expect(comments[0].comment).toBe("testcomment1");
    expect(comments[0].post_id).toBe(testComment.postID);
    expect(comments[0].username).toBe("testuser1");
  });
});
