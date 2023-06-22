const express = require('express');
const cors = require('cors');

const app = express();

// Preparamos el servidor para recibir JSON y URLENCODED
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Preparamos CORS
const corsOptions = { origin: '*', optionsSuccessStatus: 200 };

app.use(cors(corsOptions));

// Importamos los routers
const contactoRouter = require('../routers/contacto');
const empresaRouter = require('../routers/empresa');
const puestosRouter = require('../routers/puestos');

app.use('/api/contacto', contactoRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/puestos', puestosRouter);


module.exports = app;
