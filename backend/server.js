require('dotenv').config();
const express = require('express');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone')

const healthRouter = require('./routers/handler-ready');
const handlerUser = require('./routers/handler-user-create')

const app = express();
const port = process.env.PORT;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

app.use(express.json());

app.use('/', handlerUser);
app.use('/health', healthRouter);

app.listen(port, () => {
    console.log(`Serving on port: ${port}`)
})