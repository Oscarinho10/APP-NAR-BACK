const UsuarioService = require("../services/usuario.service");
const UsuarioRepository = require("../repositories/usuario.repository");
const EmailService = require("../services/email.service");
const jwt = require('jsonwebtoken');

class UsuarioController {
    async getAllUsuarios(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuarios();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosActivos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosActivos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosInactivos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosInactivos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosAgentesActivos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosAgentesActivos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosAgentesInactivos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosAgentesInactivos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosAgentesInactivosSolicitudReactivacion(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosAgentesInactivosSolicitudReactivacion();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosAdministradoresActivos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosAdministradoresActivos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosAdministradoresInactivos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosAdministradoresInactivos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosActivosProspectos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosActivosProspectos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsuariosInactivosProspectos(req, res) {
        try {
            const usuarios = await UsuarioService.getAllUsuariosInactivosProspectos();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUsuarioById(req, res) {
        try {
            //Validar que el Id venga en la petición
            const usuarioId = req.params.id;
            if (!usuarioId || usuarioId == '' || usuarioId == null || usuarioId == undefined) {
                throw new Error('El Id del usuario es requerido');
            }
            const usuario = await UsuarioService.getUsuarioById(usuarioId);
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCotizacionesAndEmisionesUsuarioById(req, res) {
        try {
            // Validar que el Id venga en la petición
            const usuarioId = req.params.id;
            if (!usuarioId || usuarioId.trim() === '') {
                throw new Error('El Id del usuario es requerido');
            }

            const cotizaciones = await UsuarioService.getCotizacionesByUsuarioId(usuarioId);
            const emsiones = await UsuarioService.getEmisionesByUsuarioId(usuarioId);

            res.json({
                mensaje: "Cotizaciones y emisiones por mes",
                cotizaciones,
                emsiones
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createUsuarioPostulante(req, res) {
        try {
            // Llamar a createUsuarioPostulante en lugar de createUsuario
            const usuario = await UsuarioService.createUsuarioPostulante(req.body);
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createUsuarioAgente(req, res) {
        try {
            // Llamar a createUsuarioAgente en lugar de createUsuario
            const usuario = await UsuarioService.createUsuarioAgente(req.body);
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createUsuarioAdmin(req, res) {
        try {
            const usuario = await UsuarioService.createUsuarioAdmin(req.body);

            await EmailService.enviarCorreo(
                usuario.correo,
                "bienvenidoAdministrador",
                { usuario: usuario.nombre, detalle: usuario.nuevaContrasena }
            );

            res.status(200).json({
                success: true,
                message: "Administrador creado correctamente y enviado al correo su nueva contraseña.",
                data: usuario,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUsuario(req, res) {
        try {
            const usuarioId = req.params.id;
            if (!usuarioId || usuarioId == '' || usuarioId == null || usuarioId == undefined) {
                throw new Error('El Id del usuario es requerido');
            }

            const usuario = await UsuarioService.updateUsuario(usuarioId, req.body);
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUsuarioPostulante(req, res) {
        try {
            const usuarioId = req.params.id;
            const { contrasenaActual, nuevaContrasena } = req.body;

            // Validar que se envíen todas las credenciales necesarias
            if (!usuarioId || usuarioId.trim() === '') {
                throw new Error('El Id del usuario es requerido');
            }
            if (!contrasenaActual || contrasenaActual.trim() === '') {
                throw new Error('La contraseña actual es requerida');
            }
            if (!nuevaContrasena || nuevaContrasena.trim() === '') {
                throw new Error('La nueva contraseña es requerida');
            }

            // Llamar al servicio con ambas contraseñas
            const usuario = await UsuarioService.updateUsuarioPostulante(usuarioId, contrasenaActual, nuevaContrasena);

            res.json({
                success: true,
                message: "Contraseña actualizada correctamente.",
                data: usuario
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async resetearContrasena(req, res) {
        try {
            const usuarioId = req.params.id;

            if (!usuarioId) {
                return res.status(400).json({ message: "El Id del usuario es requerido" });
            }

            const usuario = await UsuarioService.resetearContrasenaUsuario(usuarioId);

            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            await EmailService.enviarCorreo(
                usuario.correo,
                "contrasenaReseteada",
                { usuario: usuario.nombre, detalle: "Tu nueva contraseña es tu correo." }
            );

            res.status(200).json({
                success: true,
                message: "Contraseña reseteada correctamente y correo enviado correctamente.",
                data: usuario,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateUsuarioByAdmin(req, res) {
        try {
            const usuarioId = req.params.id;
            if (!usuarioId || usuarioId == '' || usuarioId == null || usuarioId == undefined) {
                throw new Error('El Id del usuario es requerido');
            }

            // Llamar a la función updateUsuarioByAdmin desde el servicio
            const usuario = await UsuarioService.updateUsuarioByAdmin(usuarioId, req.body);
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUsuarioStatusInactive(req, res) {
        try {
            const usuarioId = req.params.id;
            const usuario = await UsuarioService.updateUsuarioStatusInactive(usuarioId, req.body);

            await EmailService.enviarCorreo(
                usuario.correo,
                "usuarioInactivado",
                { usuario: usuario.nombre }
            );

            res.status(200).json({
                success: true,
                message: "Usuario inactivado correctamente y enviado a su correo el mensaje.",
                data: usuario,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUsuarioStatusInactiveRolAgente(req, res) {
        try {
            const usuarioId = req.params.id;
            const usuario = await UsuarioService.updateUsuarioStatusInactiveRolAgente(usuarioId);

            if (usuario.estado === 'inactivo') {
                await EmailService.enviarCorreo(
                    usuario.correo,
                    "usuarioInactivadoPorCuota",
                    { usuario: usuario.nombre }
                );

                res.status(200).json({
                    success: true,
                    message: "Usuario inactivado por no cumplir con la cuota mensual y enviado a su correo el mensaje.",
                    data: usuario,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Usuario cumple con la cuota mensual.",
                    data: usuario,
                });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUsuarioStatusActive(req, res) {
        try {
            const usuarioId = req.params.id;

            const usuario = await UsuarioService.updateUsuarioStatusActive(usuarioId);

            await EmailService.enviarCorreo(
                usuario.correo,
                "usuarioActivado",
                { usuario: usuario.nombre }
            );

            res.status(200).json({
                success: true,
                message: "Usuario reactivado correctamente y enviado a su correo el mensaje.",
                data: usuario,
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateUsuarioStatusDenegado(req, res) {
        try {
            const usuarioId = req.params.id;
            const usuario = await UsuarioService.updateUsuarioStatusDenegado(usuarioId, req.body);

            await EmailService.enviarCorreo(
                usuario.correo,
                "postulanteDenegado",
                { usuario: usuario.nombre }
            );

            res.status(200).json({
                success: true,
                message: "Usuario denegado correctamente y enviado a su correo el mensaje.",
                data: usuario,
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateAgenteStatusReactivaciones(req, res) {
        try {
            const usuarioId = req.params.id;
            const usuario = await UsuarioService.updateAgenteStatusReactivaciones(usuarioId, req.body);
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updatePostulanteRolAgente(req, res) {
        try {
            const usuarioId = req.params.id;

            const resultado = await UsuarioService.updatePostulanteRolAgente(usuarioId);

            const usuario = await UsuarioRepository.getUsuarioById(usuarioId);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            await EmailService.enviarCorreo(
                usuario.correo,
                "confirmacionCambioRolAgente",
                { usuario: usuario.nombre, detalle: "Agente" }
            );

            res.status(200).json({
                success: true,
                message: "Agente aceptado correctamente y enviado a su respectivo correo mensaje de confirmación.",
                data: resultado,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updatePostulanteAceptado(req, res) {
        try {
            const usuarioId = req.params.id;

            const resultado = await UsuarioService.updatePostulanteAceptado(usuarioId);

            const usuario = await UsuarioRepository.getUsuarioById(usuarioId);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            await EmailService.enviarCorreo(
                usuario.correo,
                "bienvenidoPostulante",
                { usuario: usuario.nombre, detalle: resultado.nuevaContrasena }
            );

            res.status(200).json({
                success: true,
                message: "Postulante aceptado correctamente y enviado al correo su nueva contraseña.",
                data: resultado,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async registrarEmision(req, res) {
        try {
            const usuario = await UsuarioService.registrarEmision(req.params.id);
            res.json(usuario);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async registrarCotizacion(req, res) {
        try {
            const usuario = await UsuarioService.registrarCotizacion(req.params.id);
            res.json(usuario);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getUsuariosByNombre(req, res) {
        try {
            const { nombre } = req.query;
            if (!nombre) {
                throw new Error('El nombre es requerido');
            }
            const usuarios = await UsuarioService.getUsuariosByNombre(nombre);
            res.json(usuarios);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { correo, contrasena } = req.body;

            if (!correo || !contrasena) {
                return res.status(400).json({ success: false, message: "Correo y contraseña son obligatorios" });
            }

            const usuario = await UsuarioService.login(correo, contrasena);

            const token = jwt.sign({ _id: usuario._id }, "secreta", { expiresIn: '1h' });

            console.log("Usuario autenticado:", usuario); // Verifica qué datos contiene

            return res.status(200).json({
                success: true,
                message: "Bienvenido",
                data: {
                    _id: usuario._id,
                    correo: usuario.correo,
                    rol: usuario.rol,
                    estado: usuario.estado, // Incluye explícitamente el rol
                    token,
                },
            });
        } catch (error) {
            return res.status(401).json({ success: false, message: error.message });
        }
    }

    async loginAgente(req, res) {
        try {
            const { correo, contrasena } = req.body;

            // Validar que los campos no estén vacíos
            if (!correo || !contrasena) {
                return res.status(400).json({ success: false, message: "Correo y contraseña son obligatorios" });
            }

            // Llamar al servicio para autenticar al agente
            const usuario = await UsuarioService.loginAgente(correo, contrasena);

            // Generar token JWT si el usuario existe
            const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET || "secreta", { expiresIn: '1h' });

            // Enviar respuesta exitosa con el token
            return res.status(200).json({
                success: true,
                message: "Autenticación exitosa",
                data: {
                    ...usuario,
                    contrasena: null, // Ocultar contraseña
                    token
                }
            });
        } catch (error) {
            // Manejo de errores
            const statusCode = error.message.includes("obligatorios") ? 400 : 401;
            return res.status(statusCode).json({ success: false, message: error.message });
        }
    }

    async generarCodigoRecuperacion(req, res) {
        try {
            const { correo } = req.body;
            if (!correo) {
                throw new Error("El correo es obligatorio para generar un código de recuperación.");
            }

            const resultado = await UsuarioService.generarCodigoRecuperacion(correo);

            await EmailService.enviarCorreo(
                correo,
                "recuperarContrasena",
                { usuario: correo, detalle: resultado.codigoRecuperacion }
            );

            res.status(200).json({
                success: true,
                message: "Código de recuperación generado correctamente y enviado al correo.",
                data: resultado,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async validarCodigoRecuperacion(req, res) {
        try {
            const { correo, codigoRecuperacion } = req.body;
            if (!correo || !codigoRecuperacion) {
                throw new Error("El correo del usuario y el código de recuperación son obligatorios.");
            }

            const usuario = await UsuarioService.validarCodigoRecuperacion(correo, codigoRecuperacion);
            res.status(200).json({
                success: true,
                message: "El código de recuperación es válido.",
                data: usuario,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async cambiarContrasena(req, res) {
        try {
            const { correo, codigoRecuperacion, nuevaContrasena } = req.body;

            if (!correo || !codigoRecuperacion || !nuevaContrasena) {
                throw new Error("El correo, el código de recuperación y la nueva contraseña son obligatorios.");
            }

            const usuario = await UsuarioService.recuperarContrasenaConCodigo(correo, codigoRecuperacion, nuevaContrasena);
            res.status(200).json({
                success: true,
                message: "Contraseña actualizada correctamente.",
                data: usuario,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUsuarioEmisionesYCotizaciones(req, res) {
        try {
            // Validar que el Id venga en la petición
            const usuarioId = req.params.id;
            if (!usuarioId || usuarioId.trim() === '') {
                throw new Error('El Id del usuario es requerido');
            }

            // Llamar al servicio para obtener las emisiones y cotizaciones del usuario
            const resultado = await UsuarioService.getUsuarioEmisionesYCotizaciones(usuarioId);

            // Enviar la respuesta con los datos obtenidos
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new UsuarioController();