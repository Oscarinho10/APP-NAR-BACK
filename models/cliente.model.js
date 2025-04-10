const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    apellidoPaterno: { type: String, required: true },
    apellidoMaterno: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    correo: { type: String, required: true, unique: true },
    rfc: { type: String, required: true, unique: true },
    telefono: { type: String, required: true, unique: true },
    edad: { type: Number, required: false } // Campo para la edad (no manual)
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Cliente', ClienteSchema);
