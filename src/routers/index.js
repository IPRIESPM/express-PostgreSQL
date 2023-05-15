const express = require('express');
const db = require('../model/model');

const router = express.Router();

router.get('/', db.getUsers);
router.get('/:create', db.createEmpresa);
module.exports = router;
