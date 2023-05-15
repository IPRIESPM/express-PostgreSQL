const express = require('express');
const cors = require('cors');

const app = express();
const indexRouter = require('../routers/index');

app.use(cors());
app.use('/', indexRouter);

module.exports = app;
