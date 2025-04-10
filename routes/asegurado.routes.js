const express = require('express');

const AseguradoController = require("../controllers/asegurado.controller");
const router = express.Router();

router.get('/', AseguradoController.getAllAsegurados);
router.get('/id/:id', AseguradoController.getAseguradoById);
router.get('/nombre/:nombre', AseguradoController.getAseguradosByNombre);
router.post('/', AseguradoController.createAsegurado);


module.exports = router;