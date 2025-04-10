const mongoose = require('mongoose');

const documentoPersonaConstanciaFiscal = new mongoose.Schema({
    nombre: { type: String, required: true, default: "Constancia de situación fiscal" },
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    idDocumento: { type: mongoose.Schema.Types.ObjectId, ref: 'Documento', required: true },
    estado: { type: String, required: true, default: "pendiente" }
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('DocumentoPersonaConstanciaFiscal', documentoPersonaConstanciaFiscal);    