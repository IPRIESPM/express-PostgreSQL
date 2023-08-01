const express = require('express');
const { db } = require('../database/connection');

const router = express.Router();

router.get('/:contacto/:dni', async (req, res) => {
  try {
    const { contacto, dni } = req.params;
    if (!contacto || !dni) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('SELECT * FROM TFG_anotaciones WHERE contacto_n = $1 AND dni = $2', [contacto, dni]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.post('', async (req, res) => {
  try {
    const {
      anyo, fecha, tipo, anotacion, confirmado, profesorDni, contactoN,
    } = req.body;

    console.log(req.body);
    if (!contactoN || !profesorDni) return res.status(400).json({ status: 'Faltan datos' });

    const data = await db.any('INSERT INTO TFG_anotaciones (contacto_n, dni, anyo, fecha, tipo, confirmado, anotacion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [contactoN, profesorDni, anyo, fecha, tipo, confirmado, anotacion]);
    return res.status(200).json({ status: data });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: 'Error al crear la anotación' });
  }
});

router.put('/:contacto/:dni', async (req, res) => {
  try {
    const { contacto, dni } = req.params;
    const {
      anyo, fecha, tipo, anotación, confirmado,
    } = req.body;
    if (!contacto || !dni || !anyo || !fecha || !tipo || !anotación) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('UPDATE TFG_anotaciones SET anyo = $1, fecha = $2, tipo = $3, confirmado = $4, conversacion = $5 WHERE contacto_n = $6 AND dni = $7 RETURNING *', [anyo, fecha, tipo, confirmado, contacto, dni]);
    return res.status(200).json({ status: data });
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.delete('/:contacto/:dni', async (req, res) => {
  try {
    const { contacto, dni } = req.params;
    if (!contacto || !dni) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('DELETE FROM TFG_anotaciones WHERE contacto_n = $1 AND dni = $2 RETURNING *', [contacto, dni]);
    return res.status(200).json({ status: data });
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

module.exports = router;
