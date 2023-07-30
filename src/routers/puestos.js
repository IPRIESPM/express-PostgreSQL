const express = require('express');
const { db } = require('../database/connection');
const { verifyToken } = require('../jwt/jwt');

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

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      anyo, vacantes, descrip, horario, ciclo, cifEmpresa,
    } = req.body;
    console.log(req.body);
    if (!anyo || !vacantes || !horario || !ciclo || !cifEmpresa) return res.status(400).json({ status: 'Faltan campos obligatorios' });

    const data = await db.any('INSERT INTO TFG_puestos (anyo, vacantes, descrip, horario, ciclo, cif_empresa) VALUES ($1, $2, $3, $4, $5, $6)', [anyo, vacantes, descrip, horario, ciclo, cifEmpresa]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: 'Error al crear el puesto ' });
  }
});

router.put('/', verifyToken, async (req, res) => {
  try {
    console.log('Puesto recibido', req.body);
    const {
      cod, anyo, vacantes, descrip, horario, ciclo,
    } = req.body;
    if (!cod || !anyo || !vacantes || !horario || !ciclo) return res.status(400).json({ status: 'Faltan datos necesarios' });

    const data = await db.any('UPDATE TFG_puestos SET anyo = $1, vacantes = $2, descrip = $3, horario = $4, ciclo = $5 WHERE cod = $6 RETURNING *', [anyo, vacantes, descrip, horario, ciclo, cod]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ status: 'Error al modificar el puesto' });
  }
});

router.delete('/:cod', verifyToken, async (req, res) => {
  try {
    console.log('Puesto recibido', req.params);
    if (!req.params.cod) return res.status(400).json({ status: 'Tienes que indicarme el puesto' });

    req.params.cod = parseInt(req.params.cod, 10);
    if (req.params.cod < 0) return res.status(400).json({ status: 'Tienes que darme un puesto válido' });

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
