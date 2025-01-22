// npx knex migrate:latest

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("posts", (table) => {
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
};

// npx knex migrate:rollback --all {but careful --all}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("posts");
};
