const express = require('express');

const CotizacionController = require("../controllers/cotizacion.controller");
const router = express.Router();

router.get('/', CotizacionController.getAllCotizaciones);
router.get('/pendientes', CotizacionController.getAllCotizacionesPendientes);
router.get('/pendientesByAgente/:idUsuario', CotizacionController.getAllCotizacionesPendientesByIdAgente);
router.get('/pendientesByCliente/:idCliente', CotizacionController.getAllCotizacionesPendientesByIdCliente);
router.get('/id/:id', CotizacionController.getCotizacionById);
router.post('/', CotizacionController.createCotizacion);
router.put('/id/:id', CotizacionController.updateCotizacion);
router.put('/emitida/:id', CotizacionController.updateCotizacionStatusEmitida);
router.get('/usuario/:idUsuario', CotizacionController.getCotizacionByIdUsuario);
router.get('/cliente/:idCliente', CotizacionController.getCotizacionByIdCliente);
router.get('/asegurado/:idAsegurado', CotizacionController.getCotizacionByIdAsegurado);
router.get('/seguro/:idSeguro', CotizacionController.getCotizacionByIdSeguro);

module.exports = router;