const Emision = require('../models/emision.model');
const Cotizacion = require('../models/cotizacion.model');
const Asegurado = require('../models/asegurado.model');
const Seguro = require('../models/seguro.model');
const Usuario = require('../models/usuario.model');
const Cliente = require('../models/cliente.model');

class EmisionRepository {
    async getAllEmisiones() {
        return await Emision.find();
    }

    async getEmisionById(id) {
        return await Emision.findById(id);
    }

    async getClienteById(id) {
        return await Cliente.findById(id);
    }

    async getSeguroById(id) {
        return await Seguro.findById(id);
    }

    async getAseguradoById(id) {
        return await Asegurado.findById(id);
    }

    async getUsuarioById(id) {
        return await Usuario.findById(id);
    }

    async getCotizacionById(id) {
        return await Cotizacion.findById(id);
    }

    async createEmision(emision) {
        return await Emision.create(emision);
    }

    async updateEmision(id, emision) {
        return await Emision.findByIdAndUpdate(id, emision, { new: true });
    }

    async getEmisionByIdUsuario(idUsuario) {
        return await Emision.find({ idUsuario: idUsuario });
    }

    // Obtener cotizaciones por idCliente
    async getEmisionByIdCliente(idCliente) {
        return await Emision.find({ idCliente: idCliente });
    }

    // Obtener cotizaciones por idAsegurado
    async getEmisionByIdAsegurado(idAsegurado) {
        return await Emision.find({ idAsegurado: idAsegurado });
    }

    // Obtener cotizaciones por idSeguro
    async getEmisionByIdSeguro(idSeguro) {
        return await Emision.find({ idSeguro: idSeguro });
    }

    async getEmisionByIdCotizacion(idCotizacion) {
        return await Emision.find({ idCotizacion: idCotizacion });
    }

}

module.exports = new EmisionRepository();