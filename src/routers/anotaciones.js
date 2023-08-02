const express = require('express');
const { db } = require('../database/connection');
const { verifyToken } = require('../jwt/jwt');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const query = `SELECT
      a.codigo,
      p.dni AS codigo_profesor,
      p.nombre AS nombre_profesor,
      e.cif AS cif_empresa,
      e.nombre AS nombre_empresa,
      a.anyo,
      a.fecha,
      a.tipo,
      a.confirmado,
      a.anotacion,
      a.modificado
    FROM
      public.tfg_anotaciones AS a
    JOIN
      public.tfg_profesores AS p ON a.profesor_dni = p.dni
    JOIN
      public.tfg_empresa AS e ON p.profesor_encargado = e.cif
    ORDER BY
      a.modificado DESC;
    `;

    const data = await db.any(query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: 'Error al obtener las anotaciones' });
  }
});

router.get('/:contact/', verifyToken, async (req, res) => {
  try {
    const { contact } = req.params;
    if (!contact) return res.status(400).json({ status: 'Tienes que indicar el contacto' });

    const data = await db.any('SELECT * FROM TFG_anotaciones WHERE contacto_n = $1', [contact]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: 'Error al obtener las anotaciones' });
  }
});

router.post('/:contacto', verifyToken, async (req, res) => {
  try {
    const { contacto } = req.params;
    const {
      profesorDni, anyo, fecha, tipo, confirmado, anotacion,
    } = req.body;

    console.log(req.body);
    if (!contacto || !profesorDni) return res.status(400).json({ status: 'Faltan datos' });

    const data = await db.any('INSERT INTO TFG_anotaciones (contacto_n, profesor_dni, anyo, fecha, tipo, confirmado, anotacion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [contacto, profesorDni, anyo, fecha, tipo, confirmado, anotacion]);
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

router.delete('/:cod/', verifyToken, async (req, res) => {
  try {
    const { cod } = req.params;
    if (!cod) return res.status(400).json({ status: 'Faltan datos' });

    const data = await db.any('DELETE FROM TFG_anotaciones WHERE codigo = $1 RETURNING *', [cod]);
    return res.status(200).json({ status: data });
  } catch (error) {
    return res.status(501).json({ status: 'Error al eliminar la anotación' });
  }
});

module.exports = router;
