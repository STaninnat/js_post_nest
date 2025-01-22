require("dotenv").config();
const knex = require("knex");
const dayjs = require("dayjs");

const queriesUsersKey = require("../database/helper/users-key");

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

  console.log("DB_PORT_TEST:", process.env.DB_PORT_TEST);
  console.log("DB_HOST_TEST:", process.env.DB_HOST_TEST);

  await db.schema.createTable("users_test", (table) => {
    table.text("id").primary();
    table.text("username").notNullable();
    table.text("password").notNullable();
  });

  await db.schema.createTable("users_key", (table) => {
    table.text("id").primary();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
    table.timestamp("access_token_expires_at").notNullable();
    table.text("refresh_token").unique().notNullable();
    table.timestamp("refresh_token_expires_at").notNullable();
    table
      .text("user_id")
      .notNullable()
      .references("id")
      .inTable("users_test")
      .onDelete("CASCADE");
  });
});

afterEach(async () => {
  await db("users_key").delete();
  await db("users_test").delete();
});

afterAll(async () => {
  await db.schema.dropTableIfExists("users_key");
  await db.schema.dropTableIfExists("users_test");
  await db.destroy();
});

describe("Users Key Database Functions", () => {
  const testUser = {
    id: "usertest1",
    username: "testuser1",
    password: "testpassword1",
  };

  const testUserKey = {
    id: "userkeytest1",
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    accessTokenExpiresAt: dayjs().add(15, "minute").toDate(),
    refreshToken: "test_refresh_token",
    refreshTokenExpiresAt: dayjs().add(30, "day").toDate(),
    userID: "usertest1",
  };

  beforeEach(async () => {
    await db("users_test").insert(testUser);
  });

  it("should create a user key", async () => {
    await queriesUsersKey.createUserRFKey(db, testUserKey);
    const userKey = await db("users_key").where({ id: testUserKey.id }).first();
    expect(userKey).toBeDefined();
    expect(userKey.user_id).toBe("usertest1");
  });

  it("should update a user key", async () => {
    await queriesUsersKey.createUserRFKey(db, testUserKey);

    const updatedUserKey = {
      ...testUserKey,
      updatedAt: dayjs().toDate(),
      accessTokenExpiresAt: dayjs().add(1, "hour").toDate(),
      refreshToken: "updated_refresh_token",
      refreshTokenExpiresAt: dayjs().add(30, "day").toDate(),
    };

    await queriesUsersKey.updateUserRFKey(db, updatedUserKey);
    const userKey = await db("users_key")
      .where({ id: updatedUserKey.id })
      .first();
    expect(userKey.refresh_token).toBe("updated_refresh_token");
    expect(dayjs(userKey.access_token_expires_at).toDate()).toEqual(
      updatedUserKey.accessTokenExpiresAt
    );
  });

  it("should get a user key by user ID", async () => {
    await queriesUsersKey.createUserRFKey(db, testUserKey);
    const userKey = await queriesUsersKey.getRFKeyByUserID(db, "usertest1");
    expect(userKey).toBeDefined();
    expect(userKey.refresh_token).toBe("test_refresh_token");
  });

  it("should get a user by refresh token", async () => {
    await queriesUsersKey.createUserRFKey(db, testUserKey);
    const userKey = await queriesUsersKey.getUserByRFKey(
      db,
      "test_refresh_token"
    );
    expect(userKey).toBeDefined();
    expect(userKey.user_id).toBe("usertest1");
  });
});
