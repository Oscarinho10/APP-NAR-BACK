const mongoose = require('mongoose');

const AseguradoSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    apellidoPaterno: { type: String, required: true },
    apellidoMaterno: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    correo: { type: String, unique: true, required: true},
    rfc: { type: String, unique: true, required: true },
    telefono: { type: String, required: true, unique: true },
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    edad: { type: Number, required: false } // Campo para la edad (no manual)
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Asegurado', AseguradoSchema);