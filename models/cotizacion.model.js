const mongoose = require('mongoose');

const CotizacionSchema = mongoose.Schema({
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    idAsegurado: {type: mongoose.Schema.Types.ObjectId, ref: 'Asegurado', required: true },
    idSeguro: { type: mongoose.Schema.Types.ObjectId, ref: 'Seguro', required: true },
    precioFinal: { type: Number, required: true },
    fechaCotizacion: { type: Date, default: Date.now },
    estado: {type: String, required: true, default: "pendiente"}
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Cotizacion', CotizacionSchema);