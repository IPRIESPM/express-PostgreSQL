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
    let { principal } = req.body;
    console.log(req.body);
    const {
      dni, nombre, correo, telefono, tipo, empresa, funciones,
    } = req.body;
    console.log(req.body);
    if (!dni || !nombre || !correo || !telefono || !tipo || !empresa) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    if (principal === 'true') principal = !!'true';

    await db.none('INSERT INTO TFG_contactos(dni, nombre, correo, telefono, tipo, principal, funciones) VALUES($1, $2, $3, $4, $5, $6, $7)', [dni, nombre, correo, telefono, tipo, principal, funciones]);
    const onSelect = await db.oneOrNone('SELECT * FROM TFG_contactos ORDER BY n DESC LIMIT 1');

    await db.none('INSERT INTO TFG_contacto_empresa(cif_empre, contacto_n) VALUES($1, $2)', [empresa, onSelect.n]);

    return res.status(201).json({
      n: onSelect.n,
      dni: onSelect.dni,
      nombre: onSelect.nombre,
      correo: onSelect.correo,
      telefono: onSelect.telefono,
      tipo: onSelect.tipo,
      principal: onSelect.principal,
      funciones: onSelect.funciones,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al crear el contacto' });
  }
});

router.delete('/:n', async (req, res) => {
  const { n } = req.params;

  try {
    const exist = await db.oneOrNone('SELECT 1 FROM TFG_contactos WHERE n = $1', n);
    if (!exist) {
      res.status(404).json({ error: 'La empresa no existe' });
    }

    await db.none('DELETE FROM TFG_contactos WHERE n = $1', n);

    return res.status(200).json({ message: 'Empresa eliminada correctamente' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al eliminar la empresa' });
  }
});

module.exports = router;
