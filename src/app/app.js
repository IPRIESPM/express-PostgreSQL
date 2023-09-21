const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const contactoRouter = require('../routers/contacto');
const empresaRouter = require('../routers/empresa');
const puestosRouter = require('../routers/puestos');
const anotacionesRouter = require('../routers/anotaciones');
const loggingRouter = require('../routers/iniciarSession');
const profesorRouter = require('../routers/profesor');

app.use('/api/logging', loggingRouter);

app.use('/api/profesor', profesorRouter);
app.use('/api/contacto', contactoRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/puestos', puestosRouter);
app.use('/api/anotaciones', anotacionesRouter);

module.exports = app;
