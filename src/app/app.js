const express = require('express');
const cors = require('cors');

const app = express();
const companyRouter = require('../routers/company');

app.use(cors());
app.use('/api/company', companyRouter);

module.exports = app;
