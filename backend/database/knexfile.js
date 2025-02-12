const path = require("path");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const client = new SecretManagerServiceClient();

async function getSecret(secretName) {
  const [version] = await client.accessSecretVersion({
    name: `projects/<PROJECT_ID>/secrets/${secretName}/versions/latest`,
  });

  return version.payload.data.toString("utf8");
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
async function createKnexConfig() {
  const dbUrl = await getSecret("DATABASE_URL");

  return {
    development: {
      client: "pg",
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
      migrations: {
        tableName: "knex_migrations",
        directory: "./schema",
      },
    },
    production: {
      client: "pg",
      connection: dbUrl,
      migrations: {
        tableName: "knex_migrations",
        directory: "./schema",
      },
    },
  };
}

createKnexConfig().then((knexConfig) => {
  module.exports = knexConfig;
});
