require("dotenv").config();
const express = require("express");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const db = require("./database/knex-instance");
const middlewareAuth = require("./middleware/middleware-auth");
const healthRouter = require("./routers/handler-ready");
const handlerUserCreate = require("./routers/handler-user-create");
const handlerUserSignin = require("./routers/handler-user-signin");

const app = express();
const port = process.env.PORT;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());

app.use("/user", handlerUserCreate);
app.use("/user", handlerUserSignin);
// app.use("/posts", middlewareAuth(db, jwtSecret), );

app.use("/healthz", healthRouter);

app.listen(port, () => {
  console.log(`Serving on port: ${port}`);
});
