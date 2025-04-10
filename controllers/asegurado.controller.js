const AseguradoService = require("../services/asegurado.service");

class AseguradoController {
    async getAllAsegurados(req, res) {
        try {
            const asegurados = await AseguradoService.getAllAsegurados();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(asegurados);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAseguradoById(req, res) {
        try {
            //Validar que el Id venga en la petición
            const aseguradoId = req.params.id;
            if (!aseguradoId || aseguradoId == '' || aseguradoId == null || aseguradoId == undefined) {
                throw new Error('El Id del asegurado es requerido');
            }
            const asegurado = await AseguradoService.getAseguradoById(clienteId);
            res.json(asegurado);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAseguradosByNombre(req, res) {
        try {
            const { nombre } = req.query;
            if (!nombre) {
                throw new Error('El nombre es requerido');
            }
            const asegurados = await AseguradoService.getAseguradosByNombre(nombre);
            res.json(asegurados);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createAsegurado(req, res) {
        try {
            const asegurado = await AseguradoService.createAsegurado(req.body);
            res.json(asegurado);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }   
    }

}

module.exports = new AseguradoController();
