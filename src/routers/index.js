const express = require('express');
const getUsers = require('../model/model');

const router = express.Router();

router.get('/', getUsers);

module.exports = router;
