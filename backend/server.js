require("dotenv").config();
const dayjs = require("dayjs");
const express = require("express");
const utc = require("dayjs/plugin/utc");
const cookieParser = require("cookie-parser");
const timezone = require("dayjs/plugin/timezone");

const db = require("./database/knex-instance");
const middlewareAuth = require("./middleware/auth");
const healthRouter = require("./routers/handler-ready");
const handlerPostCreate = require("./routers/handler-user-post");
const handlerUserCreate = require("./routers/handler-user-create");
const handlerUserSignin = require("./routers/handler-user-signin");
const handlerUserSignout = require("./routers/handler-user-signout");
const handlerUserRefreshKey = require("./routers/handler-refresh-key");

const app = express();
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

app.use(express.json());
app.use(cookieParser());

app.use("/user", handlerUserCreate);
app.use("/user", handlerUserSignin);
app.use("/user", handlerUserRefreshKey);

app.use("/user/auth", middlewareAuth(db, jwtSecret), handlerPostCreate);
app.use("/user/auth", middlewareAuth(db, jwtSecret), handlerUserSignout);

app.use("/healthz", healthRouter);

app.listen(port, () => {
  console.log(`Serving on port: ${port}`);
});
