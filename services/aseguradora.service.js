const AseguradoraRepository = require("../repositories/aseguradora.repository");
const Validaciones = require("../utils/validation");
const Utils = require("../utils/utils");

class AseguradoraService {
    async getAllAseguradoras() {
        return await AseguradoraRepository.getAllAseguradoras();
    }

    async getAllAseguradorasActivas() {
        return await AseguradoraRepository.getAllAseguradorasActivas();
    }

    async getAllAseguradorasInactivas() {
        return await AseguradoraRepository.getAllAseguradorasInactivas();
    }

    async getAseguradoraById(id) {
        const aseguradora = await AseguradoraRepository.getAseguradoraById(id);
        if (!aseguradora) {
            throw new Error('Aseguradora no encontrada');
        }

        return aseguradora;
    }

    async getAseguradorasByNombre(nombre) {
        const aseguradora = await AseguradoraRepository.getAseguradorasByNombre(nombre);
        if (!aseguradora) {
            throw new Error('Aseguradora no encontrada');
        }

        return aseguradora;
    }

    async createAseguradora(aseguradora) {
        //Validar que todos los campos obligatorios vengan
        if (!aseguradora.nombre || !aseguradora.informacion || !aseguradora.nombreContacto || !aseguradora.correoContacto || !aseguradora.telefonoContacto) {
            throw new Error('Todos los campos son requeridos');
        }

        //Validar que el formato del RFC y el correo sea válido
        // Validaciones.validarRFC(persona.rfc);

        Validaciones.validarCorreo(aseguradora.correoContacto);

        //Validar  que el RFC no exista en la base de datos
        const aseguradoraByCorreo = await AseguradoraRepository.getAseguradoraByCorreo(aseguradora.correoContacto);

        //Validar  que el correo no exista en la base de datos
        const aseguradoraByTelefono = await AseguradoraRepository.getAseguradoraByTelefono(aseguradora.telefonoContacto);

        if (aseguradoraByCorreo) {
            throw new Error('El correo ya existe');
        }

        if (aseguradoraByTelefono) {
            throw new Error('El telefono ya existe');

        }

        // Asegurar que el estado sea "activo" por defecto
        aseguradora.estado = "activo";

        return await AseguradoraRepository.createAseguradora(aseguradora);
    }

    async updateAseguradora(id, aseguradora) {
        //Validar que la persona exista
        const aseguradoraById = await AseguradoraRepository.getAseguradoraById(id);
        if (!aseguradoraById) {
            throw new Error('Aseguradora no encontrada');
        }

        //Validar que todos los campos vengan en el body
        if (!aseguradora.nombre || !aseguradora.informacion || !aseguradora.nombreContacto || !aseguradora.correoContacto || !aseguradora.telefonoContacto) {
            throw new Error('Todos los campos son requeridos');
        }

        Validaciones.validarCorreo(aseguradora.correoContacto);

        const aseguradoraByCorreoAndNotId = await AseguradoraRepository.getAseguradoraByCorreoAndNotId(id, aseguradora.correoContacto);
        if (aseguradoraByCorreoAndNotId) {
            throw new Error('El correo ya existe');
        }

        const aseguradoraByTelefonoAndNotId = await AseguradoraRepository.getAseguradoraByTelefonoAndNotId(id, aseguradora.telefonoContacto);
        if (aseguradoraByTelefonoAndNotId) {
            throw new Error('El telefono ya existe');
        }

        return await AseguradoraRepository.updateAseguradora(id, aseguradora);

    }

    async updateAseguradoraStatusInactive(id) {
        //Validar que la aseguradora exista
        const aseguradora = await AseguradoraRepository.getAseguradoraById(id);
        if (!aseguradora) {
            throw new Error('Aseguradora no encontrada')
        }
        return await AseguradoraRepository.updateAseguradoraStatusInactive(id)

    }

    async updateAseguradoraStatusActive(id) {
        //Validar que la aseguradora exista
        const aseguradora = await AseguradoraRepository.getAseguradoraById(id);
        if (!aseguradora) {
            throw new Error('Aseguradora no encontrada')
        }
        return await AseguradoraRepository.updateAseguradoraStatusActive(id)

    }


}

module.exports = new AseguradoraService();