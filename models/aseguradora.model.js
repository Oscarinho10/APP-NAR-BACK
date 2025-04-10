const mongoose = require('mongoose');

const AseguradoraSchema = mongoose.Schema({
    nombre: {type: String, required: true},
    informacion: {type: String, required: true},
    nombreContacto: {type: String, required: true},
    correoContacto: {type: String, required: true, unique: true},
    telefonoContacto: {type: String, required: true, unique: true},
    estado: {type: String, required: true, default: "activo"}
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Aseguradora', AseguradoraSchema);