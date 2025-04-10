const ClienteService = require("../services/cliente.service");

class ClienteController {
    async getAllClientes(req, res) {
        try {
            const clientes = await ClienteService.getAllClientes();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(clientes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllClientesByIdUsuario(req, res) {
        try {
            const { idUsuario } = req.params; // Obtenemos el idUsuario desde los parámetros de la URL
            const clientes = await ClienteService.getAllClientesByIdUsuario(idUsuario);
            res.status(200).json(clientes); // Enviar la respuesta con los clientes encontrados
        } catch (error) {
            res.status(400).json({ message: error.message }); // Manejo de errores
        }
    }
    

    async getClienteById(req, res) {
        try {
            //Validar que el Id venga en la petición
            const clienteId = req.params.id;
            if (!clienteId || clienteId == '' || clienteId == null || clienteId == undefined) {
                throw new Error('El Id del cliente es requerido');
            }
            const cliente = await ClienteService.getClienteById(clienteId);
            res.json(cliente);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getClienteByRFC(req, res) {
        try {
            //Validar que el Id venga en la petición
            const clienteRFC = req.params.rfc;
            if (!clienteRFC || clienteRFC == '' || clienteRFC == null || clienteRFC == undefined) {
                throw new Error('El Id del cliente es requerido');
            }
            const cliente = await ClienteService.getClienteByRFC(clienteRFC);
            res.json(cliente);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getClientesByNombre(req, res) {
        try {
            const { nombre } = req.query;
            if (!nombre) {
                throw new Error('El nombre es requerido');
            }
            const clientes = await ClienteService.getClientesByNombre(nombre);
            res.json(clientes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createCliente(req, res) {
        try {
            const cliente = await ClienteService.createCliente(req.body);
            res.json(cliente);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ClienteController();
