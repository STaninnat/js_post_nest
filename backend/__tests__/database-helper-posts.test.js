require("dotenv").config({ path: "./.env.test" });
const dayjs = require("dayjs");

const { setupDb, teardownDb } = require("../dbSetup");
const queriesUsers = require("../database/helper/users");
const queriesUsersPost = require("../database/helper/posts");

let db;
beforeAll(async () => {
  db = await setupDb();
});

afterEach(async () => {
  await db("users").delete();
});

afterAll(async () => {
  await teardownDb();
});

describe("Users Posts Database Functions", () => {
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

  beforeEach(async () => {
    await queriesUsers.createUser(db, testUser);
    await queriesUsersPost.createPost(db, testUserPost);
  });

  it("should create a post", async () => {
    const post = await db("posts").where({ id: testUserPost.id }).first();

    expect(post).toBeDefined();
    expect(post.post).toBe("testpost1");
    expect(post.user_id).toBe("usertest1");
  });

  it("should get a post by ID", async () => {
    const post = await queriesUsersPost.getPostByID(db, testUserPost.id);

    expect(post).toBeDefined();
    expect(post.post).toBe("testpost1");
  });

  it("should get posts by user ID", async () => {
    const posts = await queriesUsersPost.getPostsByUserID(db, "usertest1");

    expect(posts).toBeInstanceOf(Array);
    expect(posts.length).toBeGreaterThan(0);

    const post = posts[0];
    expect(post).toBeDefined();
    expect(post.post).toBe("testpost1");
    expect(post.username).toBe("testuser1");
  });

  it("should get all posts", async () => {
    const posts = await queriesUsersPost.getAllPosts(db);

    expect(posts).toHaveLength(1);
    expect(posts[0].post).toBe("testpost1");
  });

  it("should update a post", async () => {
    const updatedPost = {
      post: "updatedpost1",
      updatedAt: dayjs().toDate(),
    };

    await queriesUsersPost.updatePost(db, testUserPost.id, updatedPost);

    const post = await db("posts").where({ id: testUserPost.id }).first();
    expect(post.post).toBe("updatedpost1");
  });

  it("should delete a post", async () => {
    await queriesUsersPost.deletePost(db, testUserPost.id);

    const post = await db("posts").where({ id: testUserPost.id }).first();
    expect(post).toBeUndefined();
  });
});
