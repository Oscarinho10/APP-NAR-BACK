class Validaciones {
    constructor() {

    }

    validarRFC(rfc) {
        let regexRFC = /^[A-ZÑ]{4}\d{6}[A-Z0-9]{3}$/;
        if (!regexRFC.test(rfc)) {
            throw new Error('El RFC no tiene el formato correcto');
        }
    }

    validarCorreo(correo) {
        let regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexCorreo.test(correo)) {
            throw new Error('El correo no tiene el formato correcto')
        }
    }

    validarCURP(curp) {
        let regexCURP = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z]{2}$/;
        if (!regexCURP.test(curp)) {
            throw new Error('El CURP no tiene el formato correcto');
        }
    }

    validarContrasena(contrasena) {
        if (contrasena.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
    }

    esFechaValida(fecha) {
        const regexFecha = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

        if (!regexFecha.test(fecha)) return false;

        // Validar que la fecha sea real usando Date()
        const date = new Date(fecha);
        return date.toISOString().split('T')[0] === fecha;
    }
}

module.exports = new Validaciones();