require("dotenv").config({ path: "./.env.test" });
const dayjs = require("dayjs");

const { setupDb, teardownDb } = require("../dbSetup");
const queriesUsers = require("../database/helper/users");

let db;
beforeAll(async () => {
  db = await setupDb();
});

afterEach(async () => {
  await db("comments").delete();
  await db("posts").delete();
  await db("users_key").delete();
  await db("users").delete();
});

afterAll(async () => {
  await teardownDb();
});

describe("User Database Functions", () => {
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
    expect(user.id).toBe("usertest1");
  });

  it("should get a user by ID", async () => {
    await queriesUsers.createUser(db, testUser);

    const user = await queriesUsers.getUserByID(db, "usertest1");
    expect(user).toBeDefined();
    expect(user.username).toBe("testuser1");
  });

  it("should update a user", async () => {
    await queriesUsers.createUser(db, testUser);

    const updatedUser = {
      id: "usertest1",
      updatedAt: dayjs().toDate(),
      apiKey: "new_api_key",
      apiKeyExpiresAt: dayjs().add(30, "day").toDate(),
    };

    await queriesUsers.updateUser(db, updatedUser);

    const user = await db("users").where({ id: "usertest1" }).first();
    expect(user.api_key).toBe("new_api_key");
  });
});
