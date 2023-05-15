const express = require('express');
const { db } = require('../database/connection');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await db.one('SELECT * FROM TFG_empresa');
    res.status(200).json(data);
  } catch (error) {
    console.log(`Error ${error}`);
    res.status(501).json({ status: error });
  }
});

router.get('/create', async (req, res) => {
  try {
    await db.none(`create table TFG_empresa(
            cif varchar(12) primary key,
            nombre varchar(60),
            localidad varchar(50),
            comunidad varchar(50),
            direccion varchar(100),
            telefono integer
          );`);
    res.status(201).json({
      status: true,
      data: 'Data inserted correctly',
    });
  } catch (error) {
    console.log(`Your program fail correctly ${error}`);
    res.json('error');
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(300).json({});
    }

    const data = await db.once('SELECT * FROM TFG_empresa WHERE cif = ?;', id);
    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).json('Your program fail correctly ');
  }
});

router.get('/seed', async (req, res) => {
  try {
    const newEmpresa = {
      cif: 'A12345678',
      nombre: 'Empresa A',
      localidad: 'Ciudad A',
      comunidad: 'Comunidad A',
      direccion: 'Dirección A',
      telefono: 123456789,
    };
    const data = await db.none('INSERT INTO TFG_empresa (cif, nombre, localidad, comunidad, direccion, telefono) VALUES ($1,$2,$3,$4,$5,$6) ', [newEmpresa.cif, newEmpresa.nombre, newEmpresa.localidad, newEmpresa.comunidad, newEmpresa.direccion, newEmpresa.telefono]);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(`Your program fail correctly ${error}`);
  }
});
module.exports = router;
