const express = require('express');

const SeguroController = require("../controllers/seguro.controller");
const router = express.Router();

router.get('/', SeguroController.getAllSeguros);
router.get('/activos', SeguroController.getAllSegurosActivos)
router.get('/id/:id', SeguroController.getSeguroById);
router.get('/idAseguradora/:id', SeguroController.getAseguradoraById);
router.get('/segurosByAseguradora/:idAseguradora', SeguroController.getAllSegurosByIdAseguradora);
router.get('/tipo/:tipo', SeguroController.getAseguradorasByTipo);
router.post('/', SeguroController.createSeguro);
router.put('/id/:id', SeguroController.updateSeguro);
router.put('/inactive/:id', SeguroController.updateSeguroStatusInactive);
router.put('/active/:id', SeguroController.updateSeguroStatusActive);

module.exports = router;