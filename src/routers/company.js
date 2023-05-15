const express = require('express');
const { db } = require('../database/connection');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await db.one('SELECT * FROM TFG_empresa');
    res.status(200).json(data.value);
  } catch (error) {
    console.log(`Error ${error}`);
    res.status(501).json({ status: error });
  }
});

router.get('/create', async (req, res) => {
  try {
    const data = await db.none(`create table TFG_empresa(
            cif varchar(12) primary key,
            nombre varchar(60),
            localidad varchar(50),
            comunidad varchar(50),
            direccion varchar(100),
            telefono integer
          );`);
    res.json(data);
  } catch (error) {
    console.log(`Error ${error}`);
    res.json('error');
  }
});

module.exports = router;
