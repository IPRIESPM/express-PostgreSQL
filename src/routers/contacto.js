const express = require('express');
const { db } = require('../database/connection');
const { verifyToken } = require('../jwt/jwt');
const verifyVersion = require('../controller/version');

const router = express.Router();

router.get('/', verifyVersion, verifyToken, async (req, res) => {
  try {
    const data = await db.any('SELECT * FROM TFG_contactos');

    const { versionData } = req;

    const response = {
      data,
      version: versionData,
    };
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(501).json({ status: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El id es requerido' });

    const data = await db.oneOrNone('SELECT * FROM TFG_contactos WHERE n = $1', id);
    if (data) return res.status(200).json({ status: true, data });
    return res.status(404).json({ error: 'El contacto no existe' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el contacto' });
  }
});

router.get('/:cif', async (req, res) => {
  try {
    const { cif } = req.params;
    if (!cif) return res.status(400).json({ error: 'El cif es requerido' });

    const data = await db.oneOrNone('SELECT * FROM TFG_contactos WHERE cif = $1', cif);
    if (data) return res.status(200).json({ status: true, data });

    return res.status(404).json({ error: 'El contacto no existe' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el contacto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      cif, nombre, localidad, comunidad, direccion, telefono,
    } = req.body;

    if (!cif || !nombre || !localidad || !comunidad || !direccion || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    await db.none('INSERT INTO TFG_empresa(cif, nombre, localidad, comunidad, direccion, telefono) VALUES($1, $2, $3, $4, $5, $6)', [cif, nombre, localidad, comunidad, direccion, telefono]);

    return res.status(201).json({ message: 'Empresa creada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear la empresa' });
  }
});

router.delete('/:n', async (req, res) => {
  const { n } = req.params;

  try {
    const exist = await db.oneOrNone('SELECT 1 FROM TFG_empresa WHERE n = $1', n);
    if (!exist) {
      res.status(404).json({ error: 'La empresa no existe' });
    }

    await db.none('DELETE FROM TFG_contactos WHERE n = $1', n);

    return res.status(200).json({ message: 'Empresa eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar la empresa' });
  }
});

module.exports = router;
