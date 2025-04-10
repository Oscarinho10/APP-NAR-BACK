const Cotizacion = require('../models/cotizacion.model'); // Ajusta la ruta según la ubicación de tu modelo

class Utils {
    calcularEdad(fechaNacimiento) {
        const fechaNac = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesActual = hoy.getMonth();
        const diaActual = hoy.getDate();
        const mesNacimiento = fechaNac.getMonth();
        const diaNacimiento = fechaNac.getDate();
        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edad--;
        }
        return edad;
    }

    async updateCotizacionStatusEmitida(idCotizacion) {
        const cotizacion = await Cotizacion.findById(idCotizacion);
        if (!cotizacion) {
            throw new Error('La cotización no existe');
        }
        cotizacion.estado = 'emitida';
        await cotizacion.save();
        return cotizacion;
    }

    generarCodigoRecuperacion() {
        // Generar un número aleatorio de 4 dígitos
        const codigo = Math.floor(1000 + Math.random() * 9000);
        return codigo.toString(); // Retorna el código como cadena de texto
    }
}

module.exports = new Utils();
