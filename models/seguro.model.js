const mongoose = require('mongoose');

const SeguroSchema = mongoose.Schema({
    idAseguradora: { type: mongoose.Schema.Types.ObjectId, ref: 'Aseguradora', required: true },
    nombre: { type: String, required: true },
    tipo: { type: String, required: true },
    cobertura: { type: String, required: true },
    precioBase: { type: Number, required: true },
    estado: { type: String, required: true, default: "activo" }
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Seguro', SeguroSchema);