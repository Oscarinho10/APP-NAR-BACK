const Aseguradora = require('../models/aseguradora.model');

class AseguradoraRepository {
    // Obtener todas las aseguradoras
    async getAllAseguradoras() {
        return await Aseguradora.find();
    }

    async getAllAseguradorasActivas() {
        return await Aseguradora.find({ estado: 'activo' }); // Retorna solo seguros activos
    }

    async getAllAseguradorasInactivas() {
        return await Aseguradora.find({ estado: 'inactivo' }); // Retorna solo seguros activos
    }

    // Obtener aseguradora por ID
    async getAseguradoraById(id) {
        return await Aseguradora.findById(id);
    }

    // Crear una nueva aseguradora
    async createAseguradora(aseguradora) {
        return await Aseguradora.create(aseguradora);
    }

    // Actualizar aseguradora
    async updateAseguradora(id, aseguradora) {
        return await Aseguradora.findByIdAndUpdate(id, aseguradora, { new: true });
    }

    // Habilitar o deshabilitar aseguradora
    async toggleEstadoAseguradora(id, estado) {
        return await Aseguradora.findByIdAndUpdate(id, { estado: estado }, { new: true });
    }

    // Buscar aseguradoras por nombre
    async getAseguradorasByNombre(nombre) {
        return await Aseguradora.find({ nombre: new RegExp(nombre, 'i') });
    }

    // Buscar aseguradora por correo de contacto
    async getAseguradoraByCorreo(correo) {
        return await Aseguradora.findOne({ correoContacto: correo });
    }

    // Buscar aseguradora por teléfono de contacto
    async getAseguradoraByTelefono(telefono) {
        return await Aseguradora.findOne({ telefonoContacto: telefono });
    }

    // Verificar si existe otro correo en otra aseguradora
    async getAseguradoraByCorreoAndNotId(id, correo) {
        return await Aseguradora.findOne({ _id: { $ne: id }, correoContacto: correo });
    }

    // Verificar si existe otro teléfono en otra aseguradora
    async getAseguradoraByTelefonoAndNotId(id, telefono) {
        return await Aseguradora.findOne({ _id: { $ne: id }, telefonoContacto: telefono });
    }

    async updateAseguradoraStatusInactive(id) {
        // new: true -> devuelve el producto actualizado
        return await Aseguradora.findByIdAndUpdate(id, { estado: 'inactivo' }, { new: true });
    }

    async updateAseguradoraStatusActive(id) {
        // new: true -> devuelve el producto actualizado
        return await Aseguradora.findByIdAndUpdate(id, { estado: 'activo' }, { new: true });
    }
}

module.exports = new AseguradoraRepository();
