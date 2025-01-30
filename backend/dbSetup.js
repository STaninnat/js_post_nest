require("dotenv").config({ path: "./.env.test" });
const knex = require("knex");

let db;

async function createTables() {
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
      .inTable("users")
      .onDelete("CASCADE");
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
}

async function setupDb() {
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

  await db.schema.dropTableIfExists("comments");
  await db.schema.dropTableIfExists("posts");
  await db.schema.dropTableIfExists("users_key");
  await db.schema.dropTableIfExists("users");

  await createTables();
  return db;
}

async function teardownDb() {
  await db.schema.dropTableIfExists("comments");
  await db.schema.dropTableIfExists("posts");
  await db.schema.dropTableIfExists("users_key");
  await db.schema.dropTableIfExists("users");

  await db.destroy();
}

module.exports = { setupDb, teardownDb };
