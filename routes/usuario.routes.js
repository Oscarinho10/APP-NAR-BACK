const express = require('express');

const UsuarioController = require("../controllers/usuario.controller");
const router = express.Router();

router.get('/', UsuarioController.getAllUsuarios);
router.get('/activos', UsuarioController.getAllUsuariosActivos);
router.get('/inactivos', UsuarioController.getAllUsuariosInactivos);
router.get('/agentesActivos', UsuarioController.getAllUsuariosAgentesActivos);
router.get('/agentesInactivos', UsuarioController.getAllUsuariosAgentesInactivos);
router.get('/agentesInactivosEnReactivacion', UsuarioController.getAllUsuariosAgentesInactivosSolicitudReactivacion);
router.get('/administradoresActivos', UsuarioController.getAllUsuariosAdministradoresActivos);
router.get('/administradoresInactivos', UsuarioController.getAllUsuariosAdministradoresInactivos);
router.get('/postulantesInactivos', UsuarioController.getAllUsuariosInactivosProspectos);
router.get('/postulantesActivos', UsuarioController.getAllUsuariosActivosProspectos);
router.get('/id/:id', UsuarioController.getUsuarioById);
router.get('/numeroCotizaciones/:id', UsuarioController.getCotizacionesAndEmisionesUsuarioById);
router.get('/nombre/:nombre', UsuarioController.getUsuariosByNombre);
router.post('/postulante', UsuarioController.createUsuarioPostulante);
router.post('/agente', UsuarioController.createUsuarioAgente);
router.post('/admin', UsuarioController.createUsuarioAdmin);
router.post('/login', UsuarioController.login);
router.put('/:id', UsuarioController.updateUsuario);
router.put('/updPostulante/:id', UsuarioController.updateUsuarioPostulante);
router.put('/postulanteAgente/:id', UsuarioController.updatePostulanteRolAgente);
router.put('/postulanteAceptado/:id', UsuarioController.updatePostulanteAceptado);
router.put('/byAdmin/:id', UsuarioController.updateUsuarioByAdmin);
router.put('/resetearContra/:id', UsuarioController.resetearContrasena);
router.post('/login/agente', UsuarioController.loginAgente); // Nueva ruta para login de postulantes
router.put('/inactive/:id', UsuarioController.updateUsuarioStatusInactive);
router.put('/active/:id', UsuarioController.updateUsuarioStatusActive);
router.put('/denegado/:id', UsuarioController.updateUsuarioStatusDenegado);
router.put('/reactivacionesActive/:id', UsuarioController.updateAgenteStatusReactivaciones);
router.put('/emision/:id', UsuarioController.registrarEmision);
router.put('/cotizacion/:id', UsuarioController.registrarCotizacion);
router.get('/cotizacionesYEmisiones/:id', UsuarioController.getUsuarioEmisionesYCotizaciones);

// Rutas para recuperación de contraseña
router.post('/recuperacion/generar', UsuarioController.generarCodigoRecuperacion); // Generar código
router.post('/recuperacion/validar', UsuarioController.validarCodigoRecuperacion); // Validar código
router.post('/recuperacion/cambiar', UsuarioController.cambiarContrasena); // Cambiar contraseña

module.exports = router;
