const express = require('express');

const AseguradoraController = require("../controllers/aseguradora.controller");
const router = express.Router();

router.get('/', AseguradoraController.getAllAseguradoras);
router.get('/activos', AseguradoraController.getAllAseguradorasActivas);
router.get('/inactivos', AseguradoraController.getAllAseguradorasInactivas);
router.get('/id/:id', AseguradoraController.getAseguradoraById);
router.get('/nombre/:nombre', AseguradoraController.getAseguradorasByNombre);
router.post('/', AseguradoraController.createAseguradora);
router.put('/:id', AseguradoraController.updateAseguradora);
router.put('/inactive/:id', AseguradoraController.updateAseguradoraStatusInactive);
router.put('/active/:id', AseguradoraController.updateAseguradoraStatusActive);

module.exports = router;