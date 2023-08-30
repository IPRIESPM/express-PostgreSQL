const express = require('express');
const { db } = require('../database/connection');
const { verifyToken } = require('../jwt/jwt');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const query = `SELECT a.anotacion,
      a.fecha,
      a.confirmado,
      p.nombre AS nombre_profesor,
      p.dni AS dni_profesor,
      c.nombre AS nombre_contacto,
      c.n AS numero_contacto,
      e.nombre AS nombre_empresa,
      e.cif AS cif_empresa
    FROM public.tfg_anotaciones AS a
    JOIN public.tfg_profesores AS p ON a.profesor_dni = p.dni
    JOIN public.tfg_contactos AS c ON a.contacto_n = c.n
    JOIN public.tfg_contacto_empresa AS ce ON c.n = ce.contacto_n
    JOIN public.tfg_empresa AS e ON ce.cif_empre = e.cif
    ORDER BY a.modificado DESC;`;

    const data = await db.any(query);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
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

router.put('/:cod', async (req, res) => {
  try {
    const { cod } = req.params;
    const {
      year, date, type, annotation, confirmed,
    } = req.body;

    console.log(req.body);

    if (!cod || !year || !date || !type) return res.status(400).json({ status: 'Faltan datos' });

    const data = await db.any('UPDATE TFG_anotaciones SET anyo = $1, fecha = $2, tipo = $3, confirmado = $4, anotacion = $5 WHERE codigo = $6', [year, date, type, confirmed, annotation, cod]);
    return res.status(200).json({ status: data });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: 'Error al editar la anotación' });
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
