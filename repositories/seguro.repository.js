const Seguro = require('../models/seguro.model');
const Aseguradora = require('../models/aseguradora.model');

class SeguroRepository {

    async getAllSeguros() {
        return await Seguro.find();
    }

    async getAllSegurosActivos() {
        return await Seguro.find({ estado: 'activo' }); // Retorna solo seguros activos
    }

    async getAllSegurosByTipAndAgeAsegurado() {
        return await Seguro.find({ estado: 'activo' }); // Retorna solo seguros activos
    }

    async getAseguradoraById(id) {
        return await Aseguradora.findById(id);
    }

    async getSeguroById(id) {
        return await Seguro.findById(id); // Devuelve null si no lo encuentra
    }    

    async createSeguro(seguro) {
        return await Seguro.create(seguro);
    }

    async updateSeguro(id, seguro) {
        return await Seguro.findByIdAndUpdate(id, seguro, { new: true });
    }

    async getSegurosByTipo(tipo) {
        return await Seguro.find({
            tipo: new RegExp(tipo, 'i'),
            estado: "activo" 
        });
    }

    async updateSeguroStatusInactive(id) {
        // new: true -> devuelve el producto actualizado
        return await Seguro.findByIdAndUpdate(id, { estado: 'inactivo' }, { new: true });
    }

    async updateSeguroStatusActive(id) {
        // new: true -> devuelve el producto actualizado
        return await Seguro.findByIdAndUpdate(id, { estado: 'activo' }, { new: true });
    }

    async getAllSegurosByAseguradoraId(idAseguradora) {
        return await Seguro.find({ idAseguradora: idAseguradora });
    }
}

module.exports = new SeguroRepository();