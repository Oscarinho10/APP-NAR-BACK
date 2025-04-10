const express = require('express');

const CuotaController = require("../controllers/cuotaMensual.controller");
const router = express.Router();

router.get('/', CuotaController.getCuota);
router.get('/id/:id', CuotaController.getCuotaById);
router.put('/id/:id', CuotaController.updateCuota);
router.post('/', CuotaController.createCuota);

module.exports = router;