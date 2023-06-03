const express = require('express');
const cors = require('cors');

const app = express();
const companyRouter = require('../routers/company');

app.use(cors());
app.use('/empresa', companyRouter);

module.exports = app;
