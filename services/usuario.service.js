const bcrypt = require("bcryptjs");
const UsuarioRepository = require("../repositories/usuario.repository");
const CuotaMensualRepository = require("../repositories/cuotaMensual.repository");
const Validaciones = require("../utils/validation");
const Utils = require("../utils/utils");

class UsuarioService {
    async getAllUsuarios() {
        return await UsuarioRepository.getAllUsuarios();
    }

    async getAllUsuariosActivos() {
        return await UsuarioRepository.getAllUsuariosActivos();
    }

    async getAllUsuariosInactivos() {
        return await UsuarioRepository.getAllUsuariosInactivos();
    }

    async getAllUsuariosAgentesActivos() {
        return await UsuarioRepository.getAllUsuariosAgentesActivos();
    }

    async getAllUsuariosAgentesInactivos() {
        return await UsuarioRepository.getAllUsuariosAgentesInactivos();
    }

    async getAllUsuariosAgentesInactivosSolicitudReactivacion() {
        return await UsuarioRepository.getAllUsuariosAgentesInactivosSolicitudReactivacion();
    }

    async getAllUsuariosAdministradoresActivos() {
        return await UsuarioRepository.getAllUsuariosAdministradoresActivos();
    }

    async getAllUsuariosAdministradoresInactivos() {
        return await UsuarioRepository.getAllUsuariosAdministradoresInactivos();
    }

    async getAllUsuariosActivosProspectos() {
        return await UsuarioRepository.getAllUsuariosActivosProspectos();
    }

    async getAllUsuariosInactivosProspectos() {
        return await UsuarioRepository.getAllUsuariosInactivosProspectos();
    }

    async getUsuarioById(id) {
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        return usuario;
    }

    async getCotizacionesByUsuarioId(id) {
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        return usuario.cotizaciones;
    }

    async getEmisionesByUsuarioId(id) {
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        return usuario.emisiones;
    }

    async getUsuariosByNombre(nombre) {
        const usuarios = await UsuarioRepository.getUsuariosByNombre(nombre);
        if (!usuarios) {
            throw new Error('Usuarios no encontrados');
        }

        return usuarios;
    }

    async createUsuarioPostulante(usuario) {
        //Validar que todos los campos obligatorios vengan
        if (!usuario.nombre || !usuario.apellidoPaterno || !usuario.apellidoMaterno || !usuario.curp || !usuario.rfc || !usuario.correo || !usuario.telefono) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar el formato de CURP, RFC, correo y contraseña
        Validaciones.validarCURP(usuario.curp);
        Validaciones.validarRFC(usuario.rfc);
        Validaciones.validarCorreo(usuario.correo);

        // Validar que el RFC, CURP, correo, y teléfono no existan en la base de datos
        const usuarioByCURP = await UsuarioRepository.getUsuarioByCURP(usuario.curp);
        const usuarioByRFC = await UsuarioRepository.getUsuarioByRFC(usuario.rfc);
        const usuarioByCorreo = await UsuarioRepository.getUsuarioByCorreo(usuario.correo);
        const usuarioByTelefono = await UsuarioRepository.getUsuarioByTelefono(usuario.telefono);

        if (usuarioByCURP) {
            throw new Error('La CURP ya existe');
        }
        if (usuarioByRFC) {
            throw new Error('El RFC ya existe');
        }
        if (usuarioByCorreo) {
            throw new Error('El correo ya existe');
        }
        if (usuarioByTelefono) {
            throw new Error('El telefono ya existe');
        }

        // Asignar el rol, fecha de registro y estado
        usuario.rol = "postulante";
        usuario.fechaRegistro = new Date();
        usuario.estado = "inactivo"; // Por defecto, estado activo

        // Guardar el usuario en la base de datos
        return await UsuarioRepository.createUsuario(usuario);
    }

    async createUsuarioAgente(usuario) {
        //Validar que todos los campos obligatorios vengan
        if (!usuario.nombre || !usuario.apellidoPaterno || !usuario.apellidoMaterno || !usuario.curp || !usuario.rfc || !usuario.correo || !usuario.contrasena || !usuario.telefono) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar el formato de CURP, RFC, correo y contraseña
        Validaciones.validarCURP(usuario.curp);
        Validaciones.validarRFC(usuario.rfc);
        Validaciones.validarCorreo(usuario.correo);
        Validaciones.validarContrasena(usuario.contrasena);

        // Validar que el RFC, CURP, correo, y teléfono no existan en la base de datos
        const usuarioByCURP = await UsuarioRepository.getUsuarioByCURP(usuario.curp);
        const usuarioByRFC = await UsuarioRepository.getUsuarioByRFC(usuario.rfc);
        const usuarioByCorreo = await UsuarioRepository.getUsuarioByCorreo(usuario.correo);
        const usuarioByTelefono = await UsuarioRepository.getUsuarioByTelefono(usuario.telefono);

        if (usuarioByCURP) {
            throw new Error('La CURP ya existe');
        }
        if (usuarioByRFC) {
            throw new Error('El RFC ya existe');
        }
        if (usuarioByCorreo) {
            throw new Error('El correo ya existe');
        }
        if (usuarioByTelefono) {
            throw new Error('El telefono ya existe');
        }

        // Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10); // 10 es el número de rondas de salt
        const contrasenaEncriptada = await bcrypt.hash(usuario.contrasena, salt);

        // Asignar la contraseña encriptada
        usuario.contrasena = contrasenaEncriptada;

        // Asignar el rol, fecha de registro y estado
        usuario.rol = "agente";
        usuario.fechaRegistro = new Date();
        usuario.estado = "activo"; // Por defecto, estado activo

        // Guardar el usuario en la base de datos
        return await UsuarioRepository.createUsuario(usuario);
    }

    async createUsuarioAdmin(usuario) {
        // Validar que todos los campos obligatorios vengan
        if (!usuario.nombre || !usuario.apellidoPaterno || !usuario.apellidoMaterno || !usuario.curp ||
            !usuario.rfc || !usuario.correo || !usuario.telefono) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar el formato de CURP, RFC, correo y contraseña
        Validaciones.validarCURP(usuario.curp);
        Validaciones.validarRFC(usuario.rfc);
        Validaciones.validarCorreo(usuario.correo);

        // Validar que el RFC, CURP, correo y teléfono no existan en la base de datos
        const usuarioByCURP = await UsuarioRepository.getUsuarioByCURP(usuario.curp);
        const usuarioByRFC = await UsuarioRepository.getUsuarioByRFC(usuario.rfc);
        const usuarioByCorreo = await UsuarioRepository.getUsuarioByCorreo(usuario.correo);
        const usuarioByTelefono = await UsuarioRepository.getUsuarioByTelefono(usuario.telefono);

        if (usuarioByCURP) throw new Error('La CURP ya existe');
        if (usuarioByRFC) throw new Error('El RFC ya existe');
        if (usuarioByCorreo) throw new Error('El correo ya existe');
        if (usuarioByTelefono) throw new Error('El teléfono ya existe');

        // Contar cuántos administradores existen actualmente
        const totalAdministradores = await UsuarioRepository.countUsuariosByRol('administrador');

        // Generar una nueva contraseña autoincremental
        const nuevaContrasena = `Administrador${totalAdministradores + 1}`;

        // Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        // Asignar la nueva contraseña encriptada y otros atributos
        usuario.contrasena = contrasenaEncriptada;
        usuario.rol = "administrador";
        usuario.fechaRegistro = new Date();
        usuario.estado = "activo"; // Por defecto, estado activo

        // Guardar el usuario en la base de datos
        const usuarioCreado = await UsuarioRepository.createUsuario(usuario);

        // Devolver el usuario creado junto con la nueva contraseña en texto plano
        return { ...usuarioCreado.toObject(), nuevaContrasena };
    }

    async updateUsuario(id, usuario) {
        const usuarioById = await UsuarioRepository.getUsuarioById(id);
        if (!usuarioById) throw new Error('Usuario no encontrado');

        if (!usuario.nombre || !usuario.apellidoPaterno || !usuario.apellidoMaterno || !usuario.curp ||
            !usuario.rfc || !usuario.correo || !usuario.telefono) {
            throw new Error('Todos los campos son requeridos');
        }

        if (usuario.rol && !["administrador", "postulante", "agente"].includes(usuario.rol.toLowerCase())) {
            throw new Error('El rol debe ser "administrador", "postulante" o "agente"');
        }

        Validaciones.validarCURP(usuario.curp);
        Validaciones.validarRFC(usuario.rfc);
        Validaciones.validarCorreo(usuario.correo);

        if (usuario.contrasena) {
            Validaciones.validarContrasena(usuario.contrasena);
            const salt = await bcrypt.genSalt(10);
            usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
        }

        const usuarioByCURPAndNotId = await UsuarioRepository.getUsuarioByCURPAndNotId(id, usuario.curp);
        if (usuarioByCURPAndNotId) throw new Error('La curp ya existe');

        const usuarioByRFCAndNotId = await UsuarioRepository.getUsuarioByRFCAndNotId(id, usuario.rfc);
        if (usuarioByRFCAndNotId) throw new Error('El RFC ya existe');

        const usuarioByCorreoAndNotId = await UsuarioRepository.getUsuarioByCorreoAndNotId(id, usuario.correo);
        if (usuarioByCorreoAndNotId) throw new Error('El correo ya existe');

        const usuarioByTelefonoAndNotId = await UsuarioRepository.getUsuarioByTelefonoAndNotId(id, usuario.telefono);
        if (usuarioByTelefonoAndNotId) throw new Error('El teléfono ya existe');

        return await UsuarioRepository.updateUsuario(id, usuario);
    }

    async updateUsuarioPostulante(id, contrasenaActual, nuevaContrasena) {
        // Obtener el usuario por ID
        const usuarioById = await UsuarioRepository.getUsuarioById(id);
        if (!usuarioById) throw new Error('Usuario no encontrado');

        // Validar que la contraseña actual y nueva están definidas
        if (!contrasenaActual || !nuevaContrasena) {
            throw new Error('Ambas contraseñas son requeridas');
        }

        // Verificar si la contraseña actual coincide con la almacenada
        const esCorrecta = await bcrypt.compare(contrasenaActual, usuarioById.contrasena);
        if (!esCorrecta) {
            throw new Error('La contraseña actual es incorrecta');
        }

        // Validar la nueva contraseña
        Validaciones.validarContrasena(nuevaContrasena);

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        // Actualizar la contraseña en la base de datos
        return await UsuarioRepository.updateUsuario(id, { contrasena: contrasenaEncriptada });
    }

    async resetearContrasenaUsuario(id) {
        const usuarioById = await UsuarioRepository.getUsuarioById(id);
        if (!usuarioById) throw new Error('Usuario no encontrado');

        // Usar el correo del usuario como contraseña
        const nuevaContrasena = usuarioById.correo;

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        return await UsuarioRepository.updateUsuario(id, { contrasena: contrasenaEncriptada });
    }

    async updateUsuarioByAdmin(id, usuario) {
        // Validar que la persona exista
        const usuarioById = await UsuarioRepository.getUsuarioById(id);
        if (!usuarioById) {
            throw new Error('Usuario no encontrado');
        }

        // Validar que los campos permitidos vengan en el body
        if (!usuario.nombre || !usuario.apellidoPaterno || !usuario.apellidoMaterno || !usuario.telefono || !usuario.correo) {
            throw new Error('Los campos nombre, apellido paterno, apellido materno, telefono y correo son requeridos');
        }

        // Validar que no se intenten modificar campos no permitidos
        if (usuario.curp || usuario.rfc || usuario.contrasena || usuario.rol) {
            throw new Error('No se puede modificar CURP, RFC, contraseña ni rol');
        }

        // Validar el correo
        Validaciones.validarCorreo(usuario.correo);

        // Validar teléfono (puedes agregar validación específica si es necesario)
        if (!usuario.telefono) {
            throw new Error('Teléfono es obligatorio');
        }

        // Validar que no haya otro usuario con el mismo correo o teléfono
        const usuarioByCorreoAndNotId = await UsuarioRepository.getUsuarioByCorreoAndNotId(id, usuario.correo);
        if (usuarioByCorreoAndNotId) {
            throw new Error('El correo ya existe');
        }

        const usuarioByTelefonoAndNotId = await UsuarioRepository.getUsuarioByTelefonoAndNotId(id, usuario.telefono);
        if (usuarioByTelefonoAndNotId) {
            throw new Error('El teléfono ya existe');
        }

        // Actualizar el usuario
        return await UsuarioRepository.updateUsuario(id, usuario);
    }

    async updateUsuarioStatusInactive(id) {
        //Validar que la aseguradora exista
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado')
        }
        return await UsuarioRepository.updateUsuarioStatusInactive(id)

    }

    async updateUsuarioStatusInactiveRolAgente(id) {
        // Validar que el usuario exista
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Validar que el usuario tenga el rol de "agente"
        if (usuario.rol !== 'agente') {
            throw new Error('El usuario no tiene el rol de agente');
        }

        // Obtener la cuota mensual
        const cuotaMensual = await CuotaMensualRepository.getCuotaMensual();
        if (!cuotaMensual) {
            throw new Error('Cuota mensual no encontrada');
        }

        // Verificar si el usuario cumple con la cuota mensual
        if (usuario.emisiones < cuotaMensual.cuotaMensual) {
            return await UsuarioRepository.updateUsuarioStatusInactiveRolAgente(id);
        }

        return usuario;
    }

    async updateUsuarioStatusActive(id) {
        // Validar que la aseguradora exista
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Incrementar el contador de reactivaciones
        await UsuarioRepository.incrementReactivaciones(id);

        // Actualizar estado y reactivaciónSolicitida
        return await UsuarioRepository.updateUsuarioStatusActive(id);
    }

    async updateUsuarioStatusDenegado(id) {
        //Validar que la aseguradora exista
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado')
        }

        return await UsuarioRepository.updateUsuarioStatusDenegado(id)
    }

    async updateAgenteStatusReactivaciones(id) {
        //Validar que la aseguradora exista
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado')
        }

        return await UsuarioRepository.updateAgenteStatusReactivaciones(id);
    }

    async updatePostulanteRolAgente(id) {
        //Validar que la aseguradora exista
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado')
        }

        return await UsuarioRepository.updatePostulanteRolAgente(id);

    }

    async updatePostulanteAceptado(id) {
        // Validar que el usuario exista
        const usuarioId = await UsuarioRepository.getUsuarioById(id);
        if (!usuarioId) {
            throw new Error('Usuario no encontrado');
        }

        // Contar cuántos postulantes existen actualmente
        const totalPostulantes = await UsuarioRepository.countUsuariosByRol('postulante');

        // Generar una nueva contraseña autoincremental
        const nuevaContrasena = `Postulante${totalPostulantes + 1}`;

        // Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        // Actualizar solo la contraseña y el estado en la base de datos
        await UsuarioRepository.updatePostulanteAceptado(id, contrasenaEncriptada);

        // Retornar la nueva contraseña generada en texto plano
        return { success: true, nuevaContrasena };
    }

    async registrarEmision(id) {
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar que el rol del usuario sea "agente"
        if (usuario.rol !== "agente") {
            throw new Error('Solo los agentes pueden registrar emisiones');
        }

        // Incrementar el contador de emisiones
        await UsuarioRepository.incrementEmisiones(id);

        return usuario;
    }

    async registrarCotizacion(id) {
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar que el rol del usuario sea "agente"
        if (usuario.rol !== "agente") {
            throw new Error('Solo los agentes pueden registrar cotizaciones');
        }

        // Incrementar el contador de emisiones
        await UsuarioRepository.incrementCotizaciones(id);

        return usuario;
    }

    async login(correo, contrasena) {
        // Validar que los campos no estén vacíos
        if (!correo || !contrasena) {
            throw new Error("Correo y contraseña son obligatorios");
        }

        // Buscar usuario por correo
        const usuario = await UsuarioRepository.getUsuarioByCorreo(correo);
        if (!usuario) {
            throw new Error("Correo o contraseña incorrectos");
        }

        // Verificar si el usuario está inactivo y no es administrador
        if (usuario.estado === "inactivo" && usuario.rol === "administrador") {
            throw new Error("Tu cuenta está inactiva. Contacta al administrador.");
        }

        if (usuario.estado === "denegado" && usuario.rol === "postulante") {
            throw new Error("Tu cuenta está inactiva. Contacta al administrador.");
        }

        // Comparar contraseñas
        const esPasswordValido = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!esPasswordValido) {
            throw new Error("Correo o contraseña incorrectos");
        }

        // Retornar usuario si la autenticación es correcta
        return {
            _id: usuario._id,
            correo: usuario.correo,
            rol: usuario.rol,
            estado: usuario.estado // Incluye explícitamente el rol
        };
    }

    async loginAgente(correo, contrasena) {
        // Validar que los campos no estén vacíos
        if (!correo || !contrasena) {
            throw new Error("Correo y contraseña son obligatorios");
        }

        // Buscar usuario por correo
        const usuario = await UsuarioRepository.getUsuarioByCorreo(correo);
        if (!usuario || usuario.rol !== "agente") {
            throw new Error("Correo o contraseña incorrectos");
        }

        // Validar la contraseña
        const esPasswordValido = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!esPasswordValido) {
            throw new Error("Correo o contraseña incorrectos");
        }

        // Retornar el usuario autenticado
        return usuario;
    }

    async generarCodigoRecuperacion(correo) {
        if (!correo) {
            throw new Error("El correo es obligatorio");
        }

        // Validar formato del correo
        Validaciones.validarCorreo(correo);

        // Buscar usuario por correo
        const usuario = await UsuarioRepository.getUsuarioByCorreo(correo);
        if (!usuario) {
            throw new Error("No se encontró un usuario con este correo");
        }

        // Generar un código único de recuperación
        const codigoRecuperacion = Utils.generarCodigoRecuperacion(); // Ejemplo: 6 dígitos numéricos
        const expiracion = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos

        // Guardar el código y la expiración en la base de datos
        await UsuarioRepository.setRecoveryCode(usuario._id, codigoRecuperacion, expiracion);

        return { codigoRecuperacion };  // Retorna el código generado
    }

    async validarCodigoRecuperacion(correo, codigo) {
        if (!correo || !codigo) {
            throw new Error("Correo y código son obligatorios");
        }

        // Validar el correo
        Validaciones.validarCorreo(correo);

        // Buscar usuario por correo
        const usuario = await UsuarioRepository.getUsuarioByCorreo(correo);
        if (!usuario) {
            throw new Error("No se encontró un usuario con este correo");
        }

        // Validar el código de recuperación usando el repository
        await UsuarioRepository.validateRecoveryCode(usuario.correo, codigo);

        return true;
    }

    async recuperarContrasenaConCodigo(correo, codigo, nuevaContrasena) {
        // Validar el código de recuperación
        await this.validarCodigoRecuperacion(correo, codigo);

        // Validar la nueva contraseña
        Validaciones.validarContrasena(nuevaContrasena);

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        // Buscar usuario por correo
        const usuario = await UsuarioRepository.getUsuarioByCorreo(correo);

        // Actualizar la contraseña del usuario
        await UsuarioRepository.updateUsuario(usuario._id, { contrasena: contrasenaEncriptada });

        // Limpiar el código de recuperación y su expiración
        await UsuarioRepository.setRecoveryCode(usuario._id, null, null);

        return "Contraseña actualizada correctamente";
    }

    async getUsuarioEmisionesYCotizaciones(id) {
        // Obtener el usuario por ID
        const usuario = await UsuarioRepository.getUsuarioById(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar que el rol del usuario sea "agente"
        if (usuario.rol !== 'agente') {
            throw new Error('Solo los usuarios con rol de agente pueden acceder a esta información');
        }

        // Devolver solo los campos id, emisiones y cotizaciones
        return {
            id: usuario._id,
            emisiones: usuario.emisiones,
            cotizaciones: usuario.cotizaciones
        };
    }

}

module.exports = new UsuarioService();