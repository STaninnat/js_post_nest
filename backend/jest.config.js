/**
 * @jest-environment node
 */
module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  globalSetup: "./globalSetup.js",
  globalTeardown: "./globalTeardown.js",
  testEnvironment: "node",
};
