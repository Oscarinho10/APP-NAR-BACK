const EmisionRepository = require("../repositories/emision.repository");
const UsuarioRepository = require("../repositories/usuario.repository");
const SeguroRepository = require("../repositories/seguro.repository");
const Validaciones = require("../utils/validation");
const Utils = require("../utils/utils");

class EmisionService {
    async getAllEmisiones() {
        return await EmisionRepository.getAllEmisiones();
    }

    async getEmisionById(id) {
        const emision = await EmisionRepository.getEmisionById(id);
        if (!emision) {
            throw new Error('Emisión no encontrada');
        }
        return emision;
    }

    async createEmision(emision) {
        // Validar campos obligatorios
        if (!emision.idUsuario || !emision.idCliente || !emision.idAsegurado ||
            !emision.idSeguro || !emision.idCotizacion) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar existencia de entidades relacionadas
        const usuario = await EmisionRepository.getUsuarioById(emision.idUsuario);
        if (!usuario) throw new Error('El usuario no existe');

        const cliente = await EmisionRepository.getClienteById(emision.idCliente);
        if (!cliente) throw new Error('El cliente no existe');

        const asegurado = await EmisionRepository.getAseguradoById(emision.idAsegurado);
        if (!asegurado) throw new Error('El asegurado no existe');

        const seguro = await EmisionRepository.getSeguroById(emision.idSeguro);
        if (!seguro) throw new Error('El seguro no existe');

        const cotizacion = await EmisionRepository.getCotizacionById(emision.idCotizacion);
        if (!cotizacion) throw new Error('La cotización no existe');

        // Validar estado de la cotización
        if (cotizacion.estado !== 'pendiente') {
            throw new Error('La cotización debe estar en estado "pendiente" para ser emitida');
        }

        // Marcar cotización como emitida
        await Utils.updateCotizacionStatusEmitida(emision.idCotizacion);

        // Asignar el precio final de la cotización al monto total de la emisión
        emision.montoTotal = cotizacion.precioFinal;

        // Registrar la emisión
        emision.fechaEmision = new Date();
        const nuevaEmision = await EmisionRepository.createEmision(emision);

        // Incrementar el contador de emisiones del usuario
        await UsuarioRepository.incrementEmisiones(emision.idUsuario);

        return nuevaEmision;
    }

    async updateEmision(id, emision) {
        // Validar campos obligatorios
        if (!emision.idUsuario || !emision.idCliente || !emision.idAsegurado ||
            !emision.idSeguro || !emision.idCotizacion) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar existencia de entidades relacionadas
        const usuario = await EmisionRepository.getUsuarioById(emision.idUsuario);
        if (!usuario) throw new Error('El usuario no existe');

        const cliente = await EmisionRepository.getClienteById(emision.idCliente);
        if (!cliente) throw new Error('El cliente no existe');

        const asegurado = await EmisionRepository.getAseguradoById(emision.idAsegurado);
        if (!asegurado) throw new Error('El asegurado no existe');

        const seguro = await EmisionRepository.getSeguroById(emision.idSeguro);
        if (!seguro) throw new Error('El seguro no existe');

        return await EmisionRepository.updateEmision(id, emision);
    }

    async getEmisionByIdUsuario(idUsuario) {
        return await EmisionRepository.getEmisionByIdUsuario(idUsuario);
    }

    async getEmisionByIdCliente(idCliente) {
        return await EmisionRepository.getEmisionByIdCliente(idCliente);
    }

    async getEmisionByIdAsegurado(idAsegurado) {
        return await EmisionRepository.getEmisionByIdAsegurado(idAsegurado);
    }

    async getEmisionByIdSeguro(idSeguro) {
        return await EmisionRepository.getEmisionByIdSeguro(idSeguro);
    }

    async getEmisionByIdCotizacion(idCotizacion) {
        return await EmisionRepository.getEmisionByIdCotizacion(idCotizacion);
    }

    async getSeguroById(id) {
        const seguro = await SeguroRepository.getSeguroById(id);
        if (!seguro) {
            throw new Error('Seguro no encontrado');
        }
        return seguro;
    }

}

module.exports = new EmisionService();
