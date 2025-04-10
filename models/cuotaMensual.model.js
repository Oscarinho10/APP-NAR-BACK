const mongoose = require('mongoose');

const CuotaMensualSchema = mongoose.Schema({
    cuotaMensual: {type: Number }
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('CuotaMensual', CuotaMensualSchema);