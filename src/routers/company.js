const express = require('express');
const { db } = require('../database/connection');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await db.any('SELECT * FROM TFG_empresa');
    res.status(200).json(data);
  } catch (error) {
    res.status(501).json({ status: error });
  }
});

router.get('/:cif', async (req, res) => {
  try {
    const { cif } = req.params;
    if (!cif) {
      res.status(400).json({ error: 'El CIF es requerido' });
    }

    const data = await db.oneOrNone('SELECT * FROM TFG_empresa WHERE cif = $1', cif);
    if (data) {
      res.status(200).json({
        status: true,
        data,
      });
    } else {
      res.status(404).json({ error: 'La empresa no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la empresa' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      cif, nombre, localidad, comunidad, direccion, telefono,
    } = req.body;
    if (!cif || !nombre || !localidad || !comunidad || !direccion || !telefono) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    await db.none('INSERT INTO TFG_empresa(cif, nombre, localidad, comunidad, direccion, telefono) VALUES($1, $2, $3, $4, $5, $6)', [cif, nombre, localidad, comunidad, direccion, telefono]);

    res.status(201).json({ message: 'Empresa creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la empresa' });
  }
});

router.delete('/:cif', async (req, res) => {
  const { cif } = req.params;

  try {
    const exist = await db.oneOrNone('SELECT 1 FROM TFG_empresa WHERE cif = $1', cif);
    if (!exist) {
      res.status(404).json({ error: 'La empresa no existe' });
    }

    await db.none('DELETE FROM TFG_empresa WHERE cif = $1', cif);

    res.status(200).json({ message: 'Empresa eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la empresa' });
  }
});

module.exports = router;
