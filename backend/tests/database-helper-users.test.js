require("dotenv").config();
const knex = require("knex");
const dayjs = require("dayjs");

const queriesUsers = require("../database/helper/users");

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
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
    table.text("username").notNullable();
    table.text("password").notNullable();
    table.text("gender").nullable();
    table.text("api_key").unique().notNullable();
    table.timestamp("api_key_expires_at").notNullable();
  });
});

afterEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.schema.dropTableIfExists("users");
  await db.destroy();
});

describe("User Database Functions", () => {
  const testUser = {
    id: "1",
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    username: "testuser1",
    password: "testpassword1",
    gender: "male",
    apiKey: "test_api_key",
    apiKeyExpiresAt: dayjs().add(30, "day").toDate(),
  };

  it("should create a user", async () => {
    await queriesUsers.createUser(db, testUser);
    const user = await db("users").where({ id: testUser.id }).first();
    expect(user).toBeDefined();
    expect(user.username).toBe("testuser1");
  });

  it("should get a user by API key", async () => {
    await queriesUsers.createUser(db, testUser);
    const user = await queriesUsers.getUserByApiKey(db, "test_api_key");
    expect(user).toBeDefined();
    expect(user.username).toBe("testuser1");
  });

  it("should get a user by username", async () => {
    await queriesUsers.createUser(db, testUser);
    const user = await queriesUsers.getUserByName(db, "testuser1");
    expect(user).toBeDefined();
    expect(user.id).toBe("1");
  });

  it("should get a user by ID", async () => {
    await queriesUsers.createUser(db, testUser);
    const user = await queriesUsers.getUserByID(db, "1");
    expect(user).toBeDefined();
    expect(user.username).toBe("testuser1");
  });

  it("should update a user", async () => {
    await queriesUsers.createUser(db, testUser);
    const updatedUser = {
      id: "1",
      updatedAt: dayjs().toDate(),
      apiKey: "new_api_key",
      apiKeyExpiresAt: dayjs().add(30, "day").toDate(),
    };
    await queriesUsers.updateUser(db, updatedUser);
    const user = await db("users").where({ id: "1" }).first();
    expect(user.api_key).toBe("new_api_key");
  });
});
