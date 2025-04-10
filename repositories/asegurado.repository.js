const Asegurado = require('../models/asegurado.model');
const Cliente = require('../models/cliente.model');

class AseguradoRepository {

    async getAllAsegurados() {
        return await Asegurado.find();
    }

    async getClienteById(id) {
        return await Cliente.findById(id);
    }

    async getAseguradoById(id) {
        return await Asegurado.findById(id);
    }

    async createAsegurado(asegurado) {
        return await Asegurado.create(asegurado);
    }

    async updateAsegurado(id, asegurado) {
        return await Asegurado.findByIdAndUpdate(id, asegurado, { new: true });
    }

    async getAseguradosByNombre(nombre) {
        return await Asegurado.find({ nombre: new RegExp(nombre, 'i') });
    }

    // Buscar aseguradora por correo de contacto
    async getAseguradoByCorreo(correo) {
        return await Asegurado.findOne({ correo: correo });
    }

    // Buscar aseguradora por teléfono de contacto
    async getAseguradoByRFC(rfc) {
        return await Asegurado.findOne({ rfc: rfc });
    }

    // Verificar si existe otro correo en otra aseguradora
    async getAseguradoByCorreoAndNotId(id, correo) {
        return await Asegurado.findOne({ _id: { $ne: id }, correo: correo });
    }

    // Verificar si existe otro teléfono en otra aseguradora
    async getAseguradoByRFCAndNotId(id, rfc) {
        return await Asegurado.findOne({ _id: { $ne: id }, rfc: rfc });
    }
}

module.exports = new AseguradoRepository();
