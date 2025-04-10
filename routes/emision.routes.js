const express = require('express');

const EmisionController = require("../controllers/emision.controller");
const router = express.Router();

router.get('/', EmisionController.getAllEmisiones);
router.get('/id/:id', EmisionController.getEmisionById);
router.get('/usuario/:idUsuario', EmisionController.getEmisionByIdUsuario);
router.get('/cliente/:idCliente', EmisionController.getEmisionesByCliente);
router.get('/asegurado/:idAsegurado', EmisionController.getEmisionByIdAsegurado);
router.get('/seguro/:idSeguro', EmisionController.getEmisionByIdSeguro);
router.get('/cotizacion/:idCotizacion', EmisionController.getEmisionByIdCotizacion);
router.get('/seguroInfo/:id', EmisionController.getSeguroById);
router.post('/', EmisionController.createEmision);
router.put('/id/:id', EmisionController.updateEmision);

module.exports = router;
