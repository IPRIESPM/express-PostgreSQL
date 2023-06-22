const express = require('express');
const { db } = require('../database/connection');
const { generateToken } = require('../jwt/jwt');
const { comprobarPassword } = require('../auth/auth');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { dni, contrasena } = req.body;
        if (!dni || !contrasena) return res.status(400).json({ status: 'Bad request' });

        // comprobamos que el usuario existe
        const data = await db.any('SELECT * FROM TFG_usuarios WHERE dni = $1', [dni]);
        if (data.length === 0) return res.status(401).json({ status: 'authentication error' });

        const { nombre, telefono } = data[0];

        // comprobamos que la contraseña es correcta
        const result = await comprobarPassword(contrasena, data[0].contrasena);
        if (!result) return res.status(401).json({ status: 'authentication error' });

        // generamos el token de autenticación
        const token = generateToken(dni, nombre, telefono);

        return res.status(200).json({ status: token });
    } catch (error) {
        return res.status(501).json({ status: 'authentication error' });
    }
});

module.exports = router;