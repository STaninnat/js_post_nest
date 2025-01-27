const dayjs = require("dayjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const request = require("supertest");

const cookieParser = require("cookie-parser");

const middlewareAuth = require("../middleware/auth");
const queriesUsers = require("../database/helper/users");

jest.mock("../database/helper/users", () => ({
  getUserByID: jest.fn(),
}));

jest.mock("../middleware/respond-json", () => ({
  respondWithError: jest.fn((res, status, message) =>
    res.status(status).send({ error: message })
  ),
}));

describe("middlewareAuth", () => {
  const jwtSecret = "testSecret";
  let app;

  beforeEach(() => {
    app = express();
    app.use(cookieParser());
    app.use((req, res, next) => {
      res.cookie = jest.fn();
      next();
    });
  });

  it("should return error if no token is provided", async () => {
    app.use(middlewareAuth({}, jwtSecret));

    const res = await request(app).get("/");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("couldn't find token");
  });

  it("should return error if token is invalid", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
    app.use((req, res, next) => {
      req.cookies = { access_token: "invalidToken" };
      next();
    });
    app.use(middlewareAuth({}, jwtSecret));

    const res = await request(app).get("/");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("invalid token");
    expect(console.error).toHaveBeenCalledWith(
      "token validation error: ",
      expect.any(Error)
    );
  });

  it("should return error if token is expired", async () => {
    const expiredToken = jwt.sign({ id: 1 }, jwtSecret, { expiresIn: "-1s" });

    app.use((req, res, next) => {
      req.cookies = { access_token: expiredToken };
      next();
    });
    app.use(middlewareAuth({}, jwtSecret));

    const res = await request(app).get("/");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("token expired");
  });

  it("should return error if user not found", async () => {
    const validToken = jwt.sign({ id: 1 }, jwtSecret, { expiresIn: "1h" });
    queriesUsers.getUserByID.mockResolvedValue(null);

    app.use((req, res, next) => {
      req.cookies = { access_token: validToken };
      next();
    });
    app.use(middlewareAuth({}, jwtSecret));

    const res = await request(app).get("/");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("couldn't get user");
  });

  it("should return error if API key is expired", async () => {
    const validToken = jwt.sign({ id: 1 }, jwtSecret, { expiresIn: "1h" });
    queriesUsers.getUserByID.mockResolvedValue({
      api_key_expires_at: dayjs().subtract(1, "year").toISOString(),
    });

    app.use((req, res, next) => {
      req.cookies = { access_token: validToken };
      next();
    });
    app.use(middlewareAuth({}, jwtSecret));

    const res = await request(app).get("/");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("api key expired");
  });

  it("should call next() if everything is valid", async () => {
    const validToken = jwt.sign({ id: 1 }, jwtSecret, { expiresIn: "1h" });
    queriesUsers.getUserByID.mockResolvedValue({
      api_key_expires_at: dayjs().add(1, "day").toISOString(),
    });

    const nextMiddleware = jest.fn((req, res) =>
      res.status(200).send("Success")
    );
    app.use((req, res, next) => {
      req.cookies = { access_token: validToken };
      next();
    });
    app.use(middlewareAuth({}, jwtSecret));
    app.use(nextMiddleware);

    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Success");
  });
});
