require("dotenv").config({ path: "./.env.test" });
const dayjs = require("dayjs");

const { setupDb, teardownDb } = require("../dbSetup");
const queriesUsers = require("../database/helper/users");
const queriesUsersKey = require("../database/helper/users-key");

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

describe("Users Key Database Functions", () => {
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
    await queriesUsers.createUser(db, testUser);
    await queriesUsersKey.createUserRFKey(db, testUserKey);
  });

  it("should create a user key", async () => {
    const userKey = await db("users_key").where({ id: testUserKey.id }).first();
    expect(userKey).toBeDefined();
    expect(userKey.user_id).toBe("usertest1");
  });

  it("should update a user key", async () => {
    const updatedUserKey = {
      userID: "usertest1",
      updatedAt: dayjs().toDate(),
      accessTokenExpiresAt: dayjs().add(1, "hour").toDate(),
      refreshToken: "updated_refresh_token",
      refreshTokenExpiresAt: dayjs().add(30, "day").toDate(),
    };

    await queriesUsersKey.updateUserRFKey(db, updatedUserKey);
    const userKey = await db("users_key")
      .where({ user_id: updatedUserKey.userID })
      .first();
    expect(userKey.refresh_token).toBe("updated_refresh_token");
    expect(dayjs(userKey.access_token_expires_at).toDate()).toEqual(
      updatedUserKey.accessTokenExpiresAt
    );
  });

  it("should get a user key by user ID", async () => {
    const userKey = await queriesUsersKey.getRFKeyByUserID(db, "usertest1");
    expect(userKey).toBeDefined();
    expect(userKey.refresh_token).toBe("test_refresh_token");
  });

  it("should get a user by refresh token", async () => {
    const userKey = await queriesUsersKey.getUserByRFKey(
      db,
      "test_refresh_token"
    );
    expect(userKey).toBeDefined();
    expect(userKey.user_id).toBe("usertest1");
  });
});
