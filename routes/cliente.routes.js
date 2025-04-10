const express = require('express');

const ClienteController = require("../controllers/cliente.controller");
const router = express.Router();

router.get('/', ClienteController.getAllClientes);
router.get('/id/:id', ClienteController.getClienteById);
router.get('/rfc/:rfc', ClienteController.getClienteByRFC);
router.get('/nombre/:nombre', ClienteController.getClientesByNombre);
router.post('/', ClienteController.createCliente);
router.get('/usuario/:idUsuario', ClienteController.getAllClientesByIdUsuario);

module.exports = router;