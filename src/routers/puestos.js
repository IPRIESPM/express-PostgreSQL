const express = require('express');
const { db } = require('../database/connection');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await db.any('SELECT * FROM TFG_puestos');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.get('/:cod', async (req, res) => {
  try {
    if (!req.params.cod) return res.status(400).json({ status: 'Bad request' });

    req.params.cod = parseInt(req.params.cod, 10);
    if (req.params.cod < 0) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('SELECT * FROM TFG_puestos WHERE cod = $1', req.params.cod);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      anyo, vacantes, descrip, horario, ciclo, cod,
    } = req.body;
    if (!cod || !anyo || !vacantes || !horario || !ciclo) return res.status(400).json({ status: 'Faltan campos obligatorios' });

    const data = await db.any('INSERT INTO TFG_puestos (anyo, vacantes, descrip, horario, ciclo, cif_empresa) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [anyo, vacantes, descrip, horario, ciclo, cod]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: 'Error al crear el contacto ' });
  }
});

router.put('/:cod', async (req, res) => {
  try {
    const {
      cod, anyo, vacantes, descrip, horario, ciclo,
    } = req.body;
    if (!cod || !anyo || !vacantes || !descrip || !horario || !ciclo) return res.status(400).json({ status: 'Bad request' });

    const codParsed = parseInt(cod, 10);
    if (codParsed < 0) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('UPDATE TFG_puestos SET anyo = $1, vacantes = $2, descrip = $3, horario = $4, ciclo = $5 WHERE cod = $6 RETURNING *', [anyo, vacantes, descrip, horario, ciclo, codParsed]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.delete('/:cod', async (req, res) => {
  try {
    if (!req.params.cod) return res.status(400).json({ status: 'Bad request' });

    req.params.cod = parseInt(req.params.cod, 10);
    if (req.params.cod < 0) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('DELETE FROM TFG_puestos WHERE cod = $1 RETURNING *', req.params.cod);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.get('/ciclo/:ciclo', async (req, res) => {
  try {
    if (!req.params.ciclo) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('SELECT * FROM TFG_puestos WHERE ciclo = $1', req.params.ciclo);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.get('/:cod/solicitantes', async (req, res) => {
  try {
    if (!req.params.cod) return res.status(400).json({ status: 'Bad request' });

    req.params.cod = parseInt(req.params.cod, 10);
    if (req.params.cod < 0) return res.status(400).json({ status: 'Bad request' });

    const data = await db.any('SELECT * FROM TFG_solicitudes WHERE cod_puesto = $1', req.params.cod);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

module.exports = router;
