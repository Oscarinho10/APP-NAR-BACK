const AseguradoraService = require("../services/aseguradora.service");

class AseguradoraController {
    async getAllAseguradoras(req, res) {
        try {
            const aseguradoras = await AseguradoraService.getAllAseguradoras();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(aseguradoras);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllAseguradorasActivas(req, res) {
        try {
            const aseguradoras = await AseguradoraService.getAllAseguradorasActivas();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(aseguradoras);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllAseguradorasInactivas(req, res) {
        try {
            const aseguradoras = await AseguradoraService.getAllAseguradorasInactivas();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(aseguradoras);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAseguradoraById(req, res) {
        try {
            //Validar que el Id venga en la petición
            const aseguradoraId = req.params.id;
            if (!aseguradoraId || aseguradoraId == '' || aseguradoraId == null || aseguradoraId == undefined) {
                throw new Error('El Id de la aseguradora es requerido');
            }
            const aseguradora = await AseguradoraService.getAseguradoraById(aseguradoraId);
            res.json(aseguradora);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createAseguradora(req, res) {
        try {
            const aseguradora = await AseguradoraService.createAseguradora(req.body);
            res.json(aseguradora);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateAseguradora(req, res) {
        try {
            const aseguradoraId = req.params.id;
            if (!aseguradoraId || aseguradoraId == '' || aseguradoraId == null || aseguradoraId == undefined) {
                throw new Error('El Id de la aseguradora es requerido');
            }

            const aseguradora = await AseguradoraService.updateAseguradora(aseguradoraId, req.body);
            res.json(aseguradora);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateAseguradoraStatusInactive(req, res) {
        try {
            const aseguradoraId = req.params.id;
            const aseguradora = await AseguradoraService.updateAseguradoraStatusInactive(aseguradoraId, req.body);
            res.json(aseguradora);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateAseguradoraStatusActive(req, res) {
        try {
            const aseguradoraId = req.params.id;
            const aseguradora = await AseguradoraService.updateAseguradoraStatusActive(aseguradoraId, req.body);
            res.json(aseguradora);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAseguradorasByNombre(req, res) {
        try {
            const { nombre } = req.query;
            if (!nombre) {
                throw new Error('El nombre es requerido');
            }
            const aseguradoras = await AseguradoraService.getAseguradorasByNombre(nombre);
            res.json(aseguradoras);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new AseguradoraController();