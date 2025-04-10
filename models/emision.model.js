const mongoose = require('mongoose');

const EmisionSchema = mongoose.Schema({
    idCotizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Cotizacion', required: true },
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    idAsegurado: { type: mongoose.Schema.Types.ObjectId, ref: 'Asegurado', required: true },
    idSeguro: { type: mongoose.Schema.Types.ObjectId, ref: 'Seguro', required: true },
    fechaEmision: { type: Date, default: Date.now },
    fechaInicio: { type: Date, required: true },
    fechaVencimiento: { type: Date, required: true },
    montoTotal: { type: Number, required: true },
    estado: { type: String, required: true, default: "activo" }
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Emision', EmisionSchema);