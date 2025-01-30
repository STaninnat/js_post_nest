const { teardownDb } = require("./dbSetup");

module.exports = async () => {
  await teardownDb();
};
