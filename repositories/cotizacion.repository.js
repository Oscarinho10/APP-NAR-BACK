const Cotizacion = require('../models/cotizacion.model');
const Asegurado = require('../models/asegurado.model');
const Seguro = require('../models/seguro.model');
const Usuario = require('../models/usuario.model');
const Cliente = require('../models/cliente.model');

class CotizacionRepository {
    async getAllCotizaciones() {
        return await Cotizacion.find();
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

    async getAllCotizacionesPendientes() {
        return await Cotizacion.find({ estado: 'pendiente' }); // Retorna solo seguros activos
    }

    async getAllCotizacionesPendientesByIdAgente(idUsuario) {
        try {
            const cotizaciones = await Cotizacion.find({ estado: 'pendiente', idUsuario });
            return cotizaciones;
        } catch (error) {
            console.error("Error al obtener cotizaciones pendientes:", error);
            throw new Error("No se pudieron obtener las cotizaciones pendientes.");
        }
    }

    async getAllCotizacionesPendientesByIdCliente(idCliente) {
        try {
            const cotizaciones = await Cotizacion.find({ estado: 'pendiente', idCliente });
            return cotizaciones;
        } catch (error) {
            console.error("Error al obtener cotizaciones pendientes:", error);
            throw new Error("No se pudieron obtener las cotizaciones pendientes.");
        }
    }

    async createCotizacion(cotizacion) {
        return await Cotizacion.create(cotizacion);
    }

    async updateCotizacion(id, cotizacion) {
        return await Cotizacion.findByIdAndUpdate(id, cotizacion, { new: true });
    }

    async updateCotizacionStatusEmitida(id) {
        // new: true -> devuelve el producto actualizado
        return await Cotizacion.findByIdAndUpdate(id, { estado: 'emitida' }, { new: true });
    }

    async getCotizacionByIdUsuario(idUsuario) {
        return await Cotizacion.find({ idUsuario: idUsuario });
    }

    // Obtener cotizaciones por idCliente
    async getCotizacionByIdCliente(idCliente) {
        return await Cotizacion.find({ idCliente: idCliente });
    }

    // Obtener cotizaciones por idAsegurado
    async getCotizacionByIdAsegurado(idAsegurado) {
        return await Cotizacion.find({ idAsegurado: idAsegurado });
    }

    // Obtener cotizaciones por idSeguro
    async getCotizacionByIdSeguro(idSeguro) {
        return await Cotizacion.find({ idSeguro: idSeguro });
    }
}

module.exports = new CotizacionRepository();
