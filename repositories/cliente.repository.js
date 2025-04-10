const Cliente = require('../models/cliente.model');

class ClienteRepository {

    async getAllClientes() {
        return await Cliente.find();
    }

    async getAllClientesByIdUsuario(idUsuario) {
        return await Cliente.find({ idUsuario });
    }    

    async getClienteById(id) {
        return await Cliente.findById(id);
    }

    async createCliente(cliente) {
        return await Cliente.create(cliente);
    }

    async updateCliente(id, cliente) {
        return await Cliente.findByIdAndUpdate(id, cliente, { new: true });
    }

    async getClientesByNombre(nombre) {
        return await Cliente.find({ nombre: new RegExp(nombre, 'i') });
    }

    // Buscar aseguradora por correo de contacto
    async getClienteByCorreo(correo) {
        return await Cliente.findOne({ correo: correo });
    }

    // Buscar aseguradora por teléfono de contacto
    async getClienteByRFC(rfc) {
        return await Cliente.findOne({ rfc: rfc });
    }

    // Verificar si existe otro correo en otra aseguradora
    async getClienteByCorreoAndNotId(id, correo) {
        return await Cliente.findOne({ _id: { $ne: id }, correo: correo });
    }

    // Verificar si existe otro teléfono en otra aseguradora
    async getClienteByRFCAndNotId(id, rfc) {
        return await Cliente.findOne({ _id: { $ne: id }, rfc: rfc });
    }
}

module.exports = new ClienteRepository();
