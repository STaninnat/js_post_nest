require("dotenv").config({ path: "./.env.test" });
const knex = require("knex");
const dayjs = require("dayjs");

const queriesUsersComment = require("../database/helper/comments");

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

  await db.schema.createTable("users", (table) => {
    table.text("id").primary();
    table.text("username").notNullable();
    table.text("password").notNullable();
  });

  await db.schema.createTable("posts", (table) => {
    table.text("id").primary();
    table.text("post").notNullable();
    table
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });

  await db.schema.createTable("comments", (table) => {
    table.text("id").primary();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
    table.text("comment").notNullable();
    table
      .text("post_id")
      .notNullable()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE");
    table
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
});

afterEach(async () => {
  await db("comments").delete();
  await db("posts").delete();
  await db("users").delete();
});

afterAll(async () => {
  await db.schema.dropTableIfExists("comments");
  await db.schema.dropTableIfExists("posts");
  await db.schema.dropTableIfExists("users");
  await db.destroy();
});

describe("Comments Database Functions", () => {
  const testUser = {
    id: "usertest1",
    username: "testuser1",
    password: "testpassword1",
  };

  const testUserPost = {
    id: "userposttest1",
    post: "testpost1",
    user_id: "usertest1",
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
    await db("users").insert(testUser);
    await db("posts").insert(testUserPost);
  });

  it("should create a comment", async () => {
    await queriesUsersComment.createComment(db, testComment);
    const comment = await db("comments").where({ id: testComment.id }).first();
    expect(comment).toBeDefined();
    expect(comment.comment).toBe("testcomment1");
    expect(comment.post_id).toBe("userposttest1");
    expect(comment.user_id).toBe("usertest1");
  });

  it("should get all comments", async () => {
    await queriesUsersComment.createComment(db, testComment);
    const comments = await queriesUsersComment.getComments(db);
    expect(comments).toHaveLength(1);
    expect(comments[0].comment).toBe("testcomment1");
    expect(comments[0].post_id).toBe("userposttest1");
    expect(comments[0].username).toBe("testuser1");
  });
});
