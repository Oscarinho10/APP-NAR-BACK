const ClienteRepository = require("../repositories/cliente.repository");
const Validaciones = require("../utils/validation");
const Utils = require("../utils/utils");

class ClienteService {
    async getAllClientes() {
        return await ClienteRepository.getAllClientes();
    }

    async getAllClientesByIdUsuario(idUsuario) {
        const clientes = await ClienteRepository.getAllClientesByIdUsuario(idUsuario);
        if (!clientes) {
            throw new Error('Clientes no encontrados');
        }

        return clientes;
        // Suponiendo que la relación de cliente con el usuario está basada en un campo `idUsuario` 
    }
    
    async getClienteById(id) {
        const cliente = await ClienteRepository.getClienteById(id);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        return cliente;
    }

    async getClienteByRFC(RFC) {
        const cliente = await ClienteRepository.getClienteByRFC(RFC);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        return cliente;
    }

    async getClientesByNombre(nombre) {
        const cliente = await ClienteRepository.getClientesByNombre(nombre);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        return cliente;
    }

    async createCliente(cliente) {
        // Validar que todos los campos obligatorios vengan
        if (!cliente.nombre || !cliente.apellidoPaterno || !cliente.apellidoMaterno || !cliente.fechaNacimiento || !cliente.correo || !cliente.rfc || !cliente.telefono) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar el formato del correo y el RFC
        Validaciones.validarCorreo(cliente.correo);
        Validaciones.validarRFC(cliente.rfc);

        // Verificar si ya existe el cliente por correo o RFC
        const clienteByCorreo = await ClienteRepository.getClienteByCorreo(cliente.correo);
        const clienteByRFC = await ClienteRepository.getClienteByRFC(cliente.rfc);

        if (clienteByCorreo) {
            throw new Error('El correo ya existe');
        }

        if (clienteByRFC) {
            throw new Error('El RFC ya existe');
        }

        // Validar que la persona sea mayor de edad
        const edad = Utils.calcularEdad(cliente.fechaNacimiento);

        // Calcular la edad y agregarla al objeto cliente
        cliente.edad = edad;

        // Crear el cliente en la base de datos
        return await ClienteRepository.createCliente(cliente);
    }


}

module.exports = new ClienteService();