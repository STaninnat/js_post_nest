const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

const {
  isValidUserName,
  hashAPIKey,
  generateRandomSHA256HASH,
  generateJWTToken,
} = require("../middleware/generate-token");

describe("Utils Test Suite", () => {
  describe("isValidUserName", () => {
    it("should return true for valid usernames", () => {
      expect(isValidUserName("user123")).toBe(true);
      expect(isValidUserName("user.name")).toBe(true);
      expect(isValidUserName("user-name")).toBe(true);
    });

    it("should return false for invalid usernames", () => {
      expect(isValidUserName("")).toBe(false);
      expect(isValidUserName("yo")).toBe(false);
      expect(isValidUserName("@&@&__")).toBe(false);
      expect(isValidUserName("invalid@username")).toBe(false);
    });
  });

  describe("hashAPIKey", () => {
    it("should return an object with hashedApiKey", async () => {
      const result = await hashAPIKey();
      expect(result).toHaveProperty("hashedApiKey");
      expect(typeof result.hashedApiKey).toBe("string");
    });

    it("should return a different hash each time", async () => {
      const hash1 = await hashAPIKey();
      const hash2 = await hashAPIKey();
      expect(hash1.hashedApiKey).not.toBe(hash2.hashedApiKey);
    });
  });

  describe("generateRandomSHA256HASH", () => {
    it("should return a 64-character hash", () => {
      const hash = generateRandomSHA256HASH();
      expect(hash).toHaveLength(64);
    });
  });

  describe("generateJWTToken", () => {
    beforeAll(() => {
      process.env.JWT_SECRET = "test_jwt_secret";
      process.env.REFRESH_SECRET = "test_refresh_secret";
    });

    it("should generate a JWT token with the correct secret", () => {
      const hashedApiKey = "test_hashed_api_key";
      const payload = { id: 1, api_key: hashedApiKey };
      const token = generateJWTToken(
        payload,
        dayjs().add(15, "minute").toDate(),
        "jwtToken"
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(1);
    });

    it("should throw an error if the secret is missing", () => {
      delete process.env.JWT_SECRET;
      expect(() =>
        generateJWTToken({}, dayjs().add(15, "minute").toDate(), "jwtToken")
      ).toThrow("jwt or refresh secret is not defined");
    });
  });
});
