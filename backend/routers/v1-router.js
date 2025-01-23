require("dotenv").config();
const express = require("express");

const db = require("../database/knex-instance");
const middlewareAuth = require("../middleware/auth");
const {
  handlerReadiness: handlerHealthzReadiness,
  handlerError: handlerHealthzError,
} = require("./handler-ready");
const handlerPost = require("./handler-user-post");
const handlerUser = require("./handler-user-create");
const handlerUserSignin = require("./handler-user-signin");
const handlerUserSignout = require("./handler-user-signout");
const handlerUserRefreshKey = require("./handler-refresh-key");

const v1Router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

v1Router.post("/user/signup", handlerUser.handlerUserCreate);
v1Router.post("/user/signin", handlerUserSignin);
v1Router.post("/user/refresh-key", handlerUserRefreshKey);

v1Router.get(
  "/user/auth/:username",
  middlewareAuth(db, jwtSecret),
  handlerUser.handlerUserGet
);
v1Router.post(
  "/user/auth/signout",
  middlewareAuth(db, jwtSecret),
  handlerUserSignout
);
v1Router.get(
  "/user/auth/posts",
  middlewareAuth(db, jwtSecret),
  handlerPost.handlerPostsGet
);
v1Router.get(
  "/user/auth/posts/:userID",
  middlewareAuth(db, jwtSecret),
  handlerPost.handlerPostsGetForUser
);
v1Router.post(
  "/user/auth/posts",
  middlewareAuth(db, jwtSecret),
  handlerPost.handlerPostCreate
);

v1Router.get("/healthz/readiness", handlerHealthzReadiness);
v1Router.get("/healthz/error", handlerHealthzError);

module.exports = v1Router;
