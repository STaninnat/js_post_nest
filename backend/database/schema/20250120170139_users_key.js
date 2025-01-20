/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// npx knex migrate:latest
exports.up = function(knex) {
    return knex.schema.createTable('users_key', (table) => {
        table.text('id').primary();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at').notNullable();
        table.timestamp('access_token_expires_at').notNullable();
        table.text('refresh_token').unique().notNullable();
        table.timestamp('refresh_token_expires_at').notNullable();
        table.text('user_id').notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
    });
};

// npx knex migrate:rollback --all {but careful --all}
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users_key');
};
