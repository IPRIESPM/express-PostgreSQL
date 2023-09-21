const express = require('express');
const { db } = require('../database/connection');
const { generateToken } = require('../jwt/jwt');
const { comprobarPassword } = require('../auth/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { dni, contrasena } = req.body;
    if (!dni || !contrasena) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('SELECT * FROM TFG_profesores WHERE dni = $1', [dni]);
    if (data.length === 0) {
      console.log('No existe el usuario');
      return res.status(401).json({ status: 'authentication error' });
    }

    const {
      nombre,
      telefono,
      correo,
      tipo,
    } = data[0];

    const result = await comprobarPassword(contrasena, data[0].contrasena);
    if (!result) {
      return res.status(401).json({ status: 'authentication error' });
    }

    const token = generateToken(dni, nombre, telefono);

    return res.status(200).json({
      token,
      user: {
        nombre, telefono, dni, correo, tipo,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: 'authentication error' });
  }
});

module.exports = router;
