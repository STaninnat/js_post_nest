require("dotenv").config();
const knex = require("knex");
const dayjs = require("dayjs");

const queriesUsersPost = require("../database/helper/posts");

let db;

beforeAll(async () => {
  db = knex({
    client: "pg",
    connection: {
      host: process.env.DB_HOST_TEST,
      port: process.env.DB_PORT_TEST,
      database: process.env.DB_NAME_TEST,
      user: process.env.DB_USER_TEST,
      password: process.env.DB_PASSWORD_TEST,
    },
  });

  await db.schema.createTable("users_test_for_post", (table) => {
    table.text("id").primary();
    table.text("username").notNullable();
    table.text("password").notNullable();
  });

  await db.schema.createTable("posts", (table) => {
    table.text("id").primary();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
    table.text("post").notNullable();
    table
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users_test_for_post")
      .onDelete("CASCADE");
  });
});

afterEach(async () => {
  await db("posts").delete();
  await db("users_test_for_post").delete();
});

afterAll(async () => {
  await db.schema.dropTableIfExists("posts");
  await db.schema.dropTableIfExists("users_test_for_post");
  await db.destroy();
});

describe("Users Posts Database Functions", () => {
  const testUser = {
    id: "usertest1",
    username: "testuser1",
    password: "testpassword1",
  };

  const testUserPost = {
    id: "userposttest1",
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    post: "testpost1",
    userID: "usertest1",
  };

  beforeEach(async () => {
    await db("users_test_for_post").insert(testUser);
  });

  it("should create a post", async () => {
    await queriesUsersPost.createPost(db, testUserPost);
    const post = await db("posts").where({ id: testUserPost.id }).first();
    expect(post).toBeDefined();
    expect(post.post).toBe("testpost1");
    expect(post.user_id).toBe("usertest1");
  });

  it("should get a post by ID", async () => {
    await queriesUsersPost.createPost(db, testUserPost);
    const post = await queriesUsersPost.getPostByID(db, testUserPost.id);
    expect(post).toBeDefined();
    expect(post.post).toBe("testpost1");
  });

  it("should get posts by user ID", async () => {
    await queriesUsersPost.createPost(db, testUserPost);
    const posts = await queriesUsersPost.getPostsByUserID(db, "usertest1");

    expect(posts).toBeInstanceOf(Array);
    expect(posts.length).toBeGreaterThan(0);

    const post = posts[0];
    expect(post).toBeDefined();
    expect(post.post).toBe("testpost1");
    expect(post.user_id).toBe("usertest1");
  });

  it("should get all posts", async () => {
    await queriesUsersPost.createPost(db, testUserPost);
    const posts = await queriesUsersPost.getAllPosts(db);
    expect(posts).toHaveLength(1);
    expect(posts[0].post).toBe("testpost1");
  });

  it("should update a post", async () => {
    await queriesUsersPost.createPost(db, testUserPost);

    const updatedPost = {
      post: "updatedpost1",
      updatedAt: dayjs().toDate(),
    };

    await queriesUsersPost.updatePost(db, testUserPost.id, updatedPost);
    const post = await db("posts").where({ id: testUserPost.id }).first();
    expect(post.post).toBe("updatedpost1");
  });

  it("should delete a post", async () => {
    await queriesUsersPost.createPost(db, testUserPost);
    await queriesUsersPost.deletePost(db, testUserPost.id);
    const post = await db("posts").where({ id: testUserPost.id }).first();
    expect(post).toBeUndefined();
  });
});
