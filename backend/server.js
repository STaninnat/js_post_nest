require("dotenv").config();
const dayjs = require("dayjs");
const express = require("express");
const utc = require("dayjs/plugin/utc");
const cookieParser = require("cookie-parser");
const timezone = require("dayjs/plugin/timezone");

const v1Router = require("./routers/v1-router");

const app = express();
const port = process.env.PORT;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

app.use(express.json());
app.use(cookieParser());

app.use("/v1", v1Router);

app.listen(port, () => {
  console.log(`Serving on port: ${port}`);
});
