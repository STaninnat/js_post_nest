require('dotenv').config();
const express = require('express');

const healthRouter = require('./routers/handler-ready');
const handlerUser = require('./routers/handler-user')

const app = express();
const port = process.env.PORT;

app.use('/', healthRouter);
app.use('/', handlerUser);

app.listen(port, () => {
    console.log(`Serving on port: ${port}`)
})