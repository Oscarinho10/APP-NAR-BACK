const CuotaMensualRepository = require('../repositories/cuotaMensual.repository');

class CuotaMensualService {
    async getCuota() {
        return await CuotaMensualRepository.findCuota();
    }

    async getCuotaById(id) {
        const cuota = await CuotaMensualRepository.findCuotaById(id);
        if (!cuota) {
            throw new Error('Usuario no encontrado');
        }

        return cuota;
    }

    async createCuota(cuota) {

        if (!cuota.cuotaMensual) {
            throw new Error('El campo es requerido');
        }

        return await CuotaMensualRepository.createCuota(cuota);
    }

    async updateCuota(id, cuota) {
        const cuotaMensual = await CuotaMensualRepository.findCuotaById(id);
        if (!cuotaMensual) {
            throw new Error('Cuota no encontrada')
        }

        if (!cuota.cuotaMensual) {
            throw new Error('El campo es requerido');
        }

        return await CuotaMensualRepository.updateCuota(id, cuota);
    }
}

module.exports = new CuotaMensualService();
