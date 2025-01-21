/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// npx knex migrate:latest
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.text("id").primary();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
    table.text("username").notNullable();
    table.text("password").notNullable();
    table.text("gender").nullable();
    table.text("api_key").unique().notNullable();
    table.timestamp("api_key_expires_at").notNullable();
  });
};

// npx knex migrate:rollback --all {but careful --all}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
