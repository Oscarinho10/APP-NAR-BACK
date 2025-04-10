const SeguroRepository = require("../repositories/seguro.repository");
const Seguro = require('../models/seguro.model'); // Ajusta la ruta según tu estructura
const Validaciones = require("../utils/validation");
const Utils = require("../utils/utils");

class SeguroService {
    async getAllSeguros() {
        return await SeguroRepository.getAllSeguros();
    }

    async getAllSegurosActivos() {
        return await SeguroRepository.getAllSegurosActivos();
    }

    async getSeguroById(id) {
        return await Seguro.findById(id);
    }    

    async getAseguradoraById(id) {
        const aseguradora = await SeguroRepository.getAseguradoraById(id);
        if (!aseguradora) {
            throw new Error('Aseguradora no encontrada');
        }

        return aseguradora;
    }

    async getAllSegurosByIdAseguradora(idAseguradora) {
        const seguros = await SeguroRepository.getAllSegurosByAseguradoraId(idAseguradora);
        
        return seguros;
    }    

    async getSegurosByTipo(tipo) {
        return await SeguroRepository.getSegurosByTipo(tipo) || [];
    }

    async createSeguro(seguro) {
        // Validar que todos los campos obligatorios estén presentes
        if (!seguro.idAseguradora || !seguro.nombre || !seguro.tipo ||
            !seguro.cobertura || !seguro.precioBase) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar que el precio base sea un número positivo
        if (typeof seguro.precioBase !== 'number' || seguro.precioBase < 0) {
            throw new Error('El precio base debe ser un número positivo');
        }

        // Validar que la aseguradora exista
        const aseguradora = await SeguroRepository.getAseguradoraById(seguro.idAseguradora);
        if (!aseguradora) {
            throw new Error('La aseguradora no existe');
        }

        // Asegurar que el estado sea "activo" por defecto
        seguro.estado = "activo";

        // Crear el seguro en la base de datos
        return await SeguroRepository.createSeguro(seguro);
    }

    async updateSeguro(id, seguro) {
        // Validar que el seguro exista
        const seguroById = await SeguroRepository.getSeguroById(id);
        if (!seguroById) {
            throw new Error('Seguro no encontrado');
        }

        // Validar que todos los campos estén presentes
        if (!seguro.idAseguradora || !seguro.nombre || !seguro.tipo ||
            !seguro.cobertura || !seguro.precioBase) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar que el precio base sea un número positivo
        if (typeof seguro.precioBase !== 'number' || seguro.precioBase < 0) {
            throw new Error('El precio base debe ser un número positivo');
        }

        // Validar que la aseguradora exista
        const aseguradora = await SeguroRepository.getAseguradoraById(seguro.idAseguradora);
        if (!aseguradora) {
            throw new Error('La aseguradora no existe');
        }

        return await SeguroRepository.updateSeguro(id, seguro);
    }

    async updateSeguroStatusInactive(id) {
        //Validar que la aseguradora exista
        const seguro = await SeguroRepository.getSeguroById(id);
        if (!seguro) {
            throw new Error('Seguro no encontrado')
        }
        return await SeguroRepository.updateSeguroStatusInactive(id)

    }

    async updateSeguroStatusActive(id) {
        //Validar que la aseguradora exista
        const seguro = await SeguroRepository.getSeguroById(id);
        if (!seguro) {
            throw new Error('Seguro no encontrado')
        }
        return await SeguroRepository.updateSeguroStatusActive(id)

    }
}

module.exports = new SeguroService();