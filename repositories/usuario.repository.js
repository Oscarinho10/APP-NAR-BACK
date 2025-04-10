const Usuario = require('../models/usuario.model');
const mongoose = require('mongoose');

class UsuarioRepository {
    // Obtener todos los usuarios
    async getAllUsuarios() {
        return await Usuario.find();
    }

    async getAllUsuariosActivos() {
        return await Usuario.find({ estado: 'activo' }); // Retorna solo usuarios activos
    }

    async getAllUsuariosInactivos() {
        return await Usuario.find({ estado: 'inactivo' }); // Retorna solo usuarios inactivos
    }

    async getAllUsuariosAgentesActivos() {
        return await Usuario.find({ estado: 'activo', rol: 'agente' }); // Retorna solo usuarios activos
    }

    async getAllUsuariosAgentesInactivos() {
        return await Usuario.find({ estado: 'inactivo', rol: 'agente' }); // Retorna solo usuarios activos
    }

    async getAllUsuariosAgentesInactivosSolicitudReactivacion() {
        return await Usuario.find({ estado: 'inactivo', rol: 'agente', reactivacionSolicitada: 'activa' }); // Retorna solo usuarios activos
    }

    async getAllUsuariosAdministradoresActivos() {
        return await Usuario.find({ estado: 'activo', rol: 'administrador' }); // Retorna solo usuarios activos
    }

    async getAllUsuariosAdministradoresInactivos() {
        return await Usuario.find({ estado: 'inactivo', rol: 'administrador' }); // Retorna solo usuarios activos
    }

    async getAllUsuariosInactivosProspectos() {
        return await Usuario.find({ estado: 'inactivo', rol: 'postulante' });
    }

    async getAllUsuariosActivosProspectos() {
        return await Usuario.find({ estado: 'activo', rol: 'postulante' });
    }

    // Obtener usuario por ID
    async getUsuarioById(id) {
        return await Usuario.findById(id);
    }

    // Crear un nuevo usuario
    async createUsuario(usuario) {
        return await Usuario.create(usuario);
    }

    // Actualizar usuario
    async updateUsuario(id, usuario) {
        return await Usuario.findByIdAndUpdate(id, usuario, {
            new: true,
            runValidators: true // Asegura que se validen los datos
        });
    }

    // Habilitar o deshabilitar usuario
    async toggleEstadoUsuario(id, estado) {
        return await Usuario.findByIdAndUpdate(id, { estado: estado }, { new: true });
    }

    // Buscar usuarios por nombre
    async getUsuariosByNombre(nombre) {
        return await Usuario.find({ nombre: new RegExp(nombre, 'i') });
    }

    // Buscar usuario por correo
    async getUsuarioByCorreo(correo) {
        return await Usuario.findOne({ correo: correo });
    }

    async getUsuarioByCURP(curp) {
        return await Usuario.findOne({ curp: curp });
    }

    async getUsuarioByRFC(rfc) {
        return await Usuario.findOne({ rfc: rfc });
    }

    // Buscar usuario por teléfono
    async getUsuarioByTelefono(telefono) {
        return await Usuario.findOne({ telefono: telefono });
    }

    // Verificar si existe otro correo en otro usuario
    async getUsuarioByCorreoAndNotId(id, correo) {
        return await Usuario.findOne({ _id: { $ne: id }, correo: correo });
    }

    async getUsuarioByCURPAndNotId(id, curp) {
        return await Usuario.findOne({ _id: { $ne: id }, curp: curp });
    }

    async getUsuarioByRFCAndNotId(id, rfc) {
        return await Usuario.findOne({ _id: { $ne: id }, rfc: rfc });
    }

    // Verificar si existe otro teléfono en otro usuario
    async getUsuarioByTelefonoAndNotId(id, telefono) {
        return await Usuario.findOne({ _id: { $ne: id }, telefono: telefono });
    }

    async updateUsuarioStatusInactive(id) {
        return await Usuario.findByIdAndUpdate(id, { estado: 'inactivo' }, { new: true });
    }

    async updateUsuarioStatusInactiveRolAgente(id) {
        return await Usuario.findByIdAndUpdate(id, { estado: 'inactivo' }, { new: true });
    }

    async updateUsuarioStatusDenegado(id) {
        return await Usuario.findByIdAndUpdate(id, { estado: 'denegado' }, { new: true });
    }

    async updateUsuarioStatusActive(id) {
        return await Usuario.findByIdAndUpdate(
            id,
            {
                estado: 'activo',
                reactivacionSolicitada: 'inactiva' // Se cambia también aquí
            },
            { new: true } // Devuelve el documento actualizado
        );
    }

    async updateAgenteStatusReactivaciones(id) {
        return await Usuario.findByIdAndUpdate(id, { reactivacionSolicitada: 'activa' }, { new: true });
    }

    async updatePostulanteAceptado(id, contrasena) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID de usuario no válido');
        }

        return await Usuario.findByIdAndUpdate(
            id,
            { $set: { estado: 'activo', contrasena: contrasena } },  // Se usa `$set` para asegurar que solo se actualizan estos campos
            { new: true }
        );
    }

    async updatePostulanteRolAgente(id) {
        return await Usuario.findByIdAndUpdate(id, { rol: 'agente' }, { new: true });
    }

    // Asignar un código de recuperación y fecha de expiración
    async setRecoveryCode(id, codigoRecuperacion, expiracion) {
        return await Usuario.findByIdAndUpdate(
            id,
            {
                codigoRecuperacion: codigoRecuperacion,
                expiracionCodigo: expiracion
            },
            { new: true }
        );
    }

    // Validar el código de recuperación
    async validateRecoveryCode(correo, codigoRecuperacion) {
        const usuario = await Usuario.findOne({
            correo: correo,
            codigoRecuperacion: codigoRecuperacion
        });

        if (!usuario) {
            throw new Error('Código de recuperación no válido.');
        }

        const now = new Date();
        if (now > usuario.expiracionCodigo) {
            throw new Error('El código de recuperación ha expirado.');
        }

        return usuario;
    }

    async incrementReactivaciones(id) {
        return await Usuario.findByIdAndUpdate(id, { $inc: { reactivaciones: 1 } }, { new: true });
    }

    async incrementEmisiones(id) {
        return await Usuario.findByIdAndUpdate(id, { $inc: { emisiones: 1 } }, { new: true });
    }

    async incrementCotizaciones(id) {
        return await Usuario.findByIdAndUpdate(id, { $inc: { cotizaciones: 1 } }, { new: true });
    }

    // Contar la cantidad de usuarios por rol
    async countUsuariosByRol(rol) {
        return await Usuario.countDocuments({ rol: rol });
    }

}

module.exports = new UsuarioRepository();
