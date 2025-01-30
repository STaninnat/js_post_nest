const { setupDb } = require("./dbSetup");

module.exports = async () => {
  await setupDb();
};
