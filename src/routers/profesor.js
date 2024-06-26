const express = require('express');
const { db } = require('../database/connection');
const { verifyToken } = require('../jwt/jwt');
const verifyVersion = require('../controller/version');
const { encriptarPassword } = require('../auth/auth');

const router = express.Router();

const query = 'SELECT dni, nombre, correo, telefono  FROM TFG_profesores';
router.get('/', verifyToken, verifyVersion, async (req, res) => {
  try {
    const data = await db.any(query);
    const { versionData } = req;

    const response = {
      data,
      version: versionData,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: error });
  }
});

router.get('/version/:version', async (req, res) => {
  try {
    const { version } = req.params;
    if (!version) return res.status(400).json({ error: 'La versión es requerida' });

    const data = await db.any('SELECT tfg_profesores FROM TFG_versiones WHERE version = $1', version);

    if (data) return res.status(200).json({ status: true, data });

    return res.status(404).json({ error: 'La versión no existe' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la versión' });
  }
});

router.post('/', encriptarPassword, async (req, res) => {
  try {
    const {
      dni, nombre, telefono, contrasena, correo,
    } = req.body;
    if (!dni || !nombre || !contrasena) {
      console.log('error en los campos');
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    await db.none('INSERT INTO TFG_profesores(dni, nombre, telefono, contrasena, correo) VALUES($1, $2, $3, $4, $5)', [dni, nombre, telefono, contrasena, correo]);

    return res.status(201).json({
      dni, nombre, telefono, correo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear al docente' });
  }
});

router.delete('/:dni', verifyToken, async (req, res) => {
  const { dni } = req.params;
  try {
    const exist = await db.oneOrNone('SELECT 1 FROM TFG_profesores WHERE dni = $1', dni);
    if (!exist) return res.status(404).json({ error: 'El docente no existe' });

    await db.none('DELETE FROM TFG_profesores WHERE dni = $1', dni);

    return res.status(200).json({ message: 'Docente dado de baja correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al dar de baja al docente' });
  }
});

router.put('/:dni', encriptarPassword, verifyToken, async (req, res) => {
  const {
    dni, nombre, telefono, correo, contrasena,
  } = req.body;

  try {
    if (!dni || !nombre || !telefono || !correo || !contrasena) {
      console.log('error en los campos');
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const exist = await db.oneOrNone('SELECT 1 FROM TFG_profesores WHERE dni = $1', dni);
    if (!exist) return res.status(404).json({ error: 'El docente no existe' });

    await db.none('UPDATE TFG_profesores SET  nombre = $2, telefono = $3, correo = $4, contrasena = $5 WHERE dni = $1', [dni, nombre, telefono, correo, contrasena]);

    return res.status(200).json({
      dni, nombre, telefono, correo, contrasena,
    });
  } catch (error) {
    console.log('error en el put');
    return res.status(500).json({ error: 'Error al modificar al docente' });
  }
});

module.exports = router;
