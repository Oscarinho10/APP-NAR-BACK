const CuotaMensual = require('../models/cuotaMensual.model');

class CuotaMensualRepository {

    async findCuota() {
        return await CuotaMensual.find();
    }

    async findCuotaById(id) {
        return await CuotaMensual.findById(id);
    }

    // Crear un nuevo usuario
    async createCuota(cuota) {
        return await CuotaMensual.create(cuota);
    }

    async updateCuota(id, cuota) {
        return await CuotaMensual.findByIdAndUpdate(id, cuota, { new: true });
    }

    async getCuotaMensual() {
        const cuota = await CuotaMensual.findOne().sort({ createdAt: -1 });
        if (!cuota) {
            throw new Error('Cuota mensual no encontrada');
        }
        return cuota;
    }
    
}

module.exports = new CuotaMensualRepository();
