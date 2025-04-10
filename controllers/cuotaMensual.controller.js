const { model } = require("mongoose");
const CuotaMensual = require("../services/cuotaMensual.service");

class CuotaController {
    async getCuota(req, res) {
        try {
            const cuota = await CuotaMensual.getCuota();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(cuota);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCuotaById(req, res) {
        try {
            //Validar que el Id venga en la petición
            const cuotaId = req.params.id;
            if (!cuotaId || cuotaId == '' || cuotaId == null || cuotaId == undefined) {
                throw new Error('El Id del usuario es requerido');
            }
            const cuota = await CuotaMensual.getCuotaById(cuotaId);
            res.json(cuota);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async createCuota(req, res) {
        try {
            // Llamar a createUsuarioPostulante en lugar de createUsuario
            const cuota = await CuotaMensual.createCuota(req.body);
            res.json(cuota);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateCuota(req, res) {
        try {
            const cuotaId = req.params.id;
            if (!cuotaId || cuotaId == '' || cuotaId == null || cuotaId == undefined) {
                throw new Error('El Id de la cuota es requerido');
            }

            const cuota = await CuotaMensual.updateCuota(cuotaId, req.body);
            res.json(cuota);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new CuotaController();
