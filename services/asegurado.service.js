const AseguradoRepository = require("../repositories/asegurado.repository");
const Validaciones = require("../utils/validation");
const Utils = require("../utils/utils");

class AseguradoService {
    async getAllAsegurados() {
        return await AseguradoRepository.getAllAsegurados();
    }

    async getAseguradoById(id) {
        const asegurado = await AseguradoRepository.getAseguradoById(id);
        if (!asegurado) {
            throw new Error('Asegurado no encontrado');
        }

        return asegurado;
    }

    async getAseguradosByNombre(nombre) {
        const asegurado = await AseguradoRepository.getAseguradosByNombre(nombre);
        if (!asegurado) {
            throw new Error('Asegurado no encontrado');
        }

        return asegurado;
    }

    async createAsegurado(asegurado) {
        //Validar que todos los campos obligatorios vengan
        if (!asegurado.nombre || !asegurado.apellidoPaterno || !asegurado.apellidoMaterno || !asegurado.fechaNacimiento || !asegurado.rfc || !asegurado.correo || !asegurado.telefono || !asegurado.idCliente) {
            throw new Error('Todos los campos son requeridos');
        }

        //Validar que el formato del RFC y el correo sea válido
        // Validaciones.validarRFC(persona.rfc);

        Validaciones.validarCorreo(asegurado.correo);

        Validaciones.validarRFC(asegurado.rfc);

        const aseguradoByCorreo = await AseguradoRepository.getAseguradoByCorreo(asegurado.correo);

        const aseguradoByRFC = await AseguradoRepository.getAseguradoByRFC(asegurado.rfc);

        if (aseguradoByCorreo) {
            throw new Error('El correo ya existe');
        }

        if (aseguradoByRFC) {
            throw new Error('El RFC ya existe');
        }

        //Validar que la fecha de nacimiento sea válida
        const edad = Utils.calcularEdad(asegurado.fechaNacimiento);

        // Calcular la edad y agregarla al objeto cliente
        asegurado.edad = edad;

        const cliente = await AseguradoRepository.getClienteById(asegurado.idCliente);
        if (!cliente) {
            throw new Error('El cliente no existe');
        }

        return await AseguradoRepository.createAsegurado(asegurado);
    }

}

module.exports = new AseguradoService();