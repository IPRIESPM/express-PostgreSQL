const express = require('express');
const { db } = require('../database/connection');
const { encriptarPassword } = require('../auth/auth');
const { verifyToken } = require('../jwt/jwt');
const verifyVersion = require('../controller/version');

const router = express.Router();

router.get('/', verifyToken, verifyVersion, async (req, res) => {
  try {
    const data = await db.any('SELECT * FROM TFG_profesores');
    const { versionData } = req;

    const response = {
      datos: data,
      version: versionData,
    };
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.get('/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    if (!dni) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('SELECT * FROM TFG_profesores WHERE dni = $1', dni);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.post('/', encriptarPassword, async (req, res) => {
  try {
    const {
      dni, nombre, telefono, contrasena,
    } = req.body;

    if (!dni || !nombre || !telefono || !contrasena) {
      console.log('Faltan datos');
      return res.status(400).json({ status: 'Bad request' });
    }

    const data = await db.any('INSERT INTO TFG_profesores (dni, nombre, telefono, contrasena) VALUES ($1, $2, $3, $4) RETURNING *', [dni, nombre, telefono, contrasena]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: error });
  }
});

router.put('/:dni', async (req, res) => {
  try {
    const {
      dni, nombre, telefono, contrasena,
    } = req.body;
    if (!dni || !nombre || !telefono || !contrasena) {
      console.log('Faltan datos');
      return res.status(400).json({ status: 'Bad request' });
    }

    const data = await db.any('UPDATE TFG_profesores SET nombre = $1, telefono = $2, contrasena = $3 WHERE dni = $4 RETURNING *', [nombre, telefono, contrasena, dni]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.delete('/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    if (!dni) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('DELETE FROM TFG_profesores WHERE dni = $1 RETURNING *', dni);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.get('/:dni/anotaciones', async (req, res) => {
  try {
    const { dni } = req.params;
    if (!dni) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('SELECT * FROM TFG_anotaciones WHERE dni_profesor = $1', dni);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});
module.exports = router;
