const sgMail = require('@sendgrid/mail');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const plantillas = {
    recuperarContrasena: (usuario, codigoRecuperacion) => ({
        asunto: "Recuperación de Contraseña",
        mensajeTexto: `Hola ${usuario}, tu código para recuperar la contraseña es: ${codigoRecuperacion}`,
        mensajeHTML: `<p>Hola ${usuario}, tu código para recuperar la contraseña es: <strong>${codigoRecuperacion}</strong></p>`
    }),
    usuarioInactivado: (usuario) => ({
        asunto: "Usuario Inactivado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que has sido inactivado.`,
        mensajeHTML: `<p>Hola ${usuario}, lamentamos informarte que has sido inactivado.</p>`
    }),
    usuarioActivado: (usuario) => ({
        asunto: "Usuario Reactivado",
        mensajeTexto: `Hola ${usuario}, bienvenido nuevamente! Has sido reactivado.`,
        mensajeHTML: `<p>Hola ${usuario}, bienvenido nuevamente! Has sido reactivado.</p>`
    }),
    confirmacionCambioRolAgente: (usuario, nuevoRol) => ({
        asunto: "Agente Aceptado",
        mensajeTexto: `Hola ${usuario}, tu rol ha sido cambiado a ${nuevoRol}. Tu contraseña sigue siendo la misma, una vez iniciando sesión, puedes cambiarla.`,
        mensajeHTML: `<p>Hola ${usuario}, tu rol ha sido cambiado a <strong>${nuevoRol}</strong>. Tu contraseña sigue siendo la misma, una vez iniciando sesión, puedes cambiarla.</p>`
    }),
    postulanteDenegado: (usuario, nuevoRol) => ({
        asunto: "Postulante Denegado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que has sido denegado, muchas gracias por tu participación y atención.`,
    }),
    contrasenaReseteada: (usuario, nuevaContrasena) => ({
        asunto: "Nueva Contraseña",
        mensajeTexto: `Hola ${usuario}, tu nueva contraseña es: ${nuevaContrasena}`,
        mensajeHTML: `<p>Hola ${usuario}, tu nueva contraseña es: <strong>${nuevaContrasena}</strong></p>`
    }),
    bienvenidoAdministrador: (usuario, nuevaContrasena) => ({
        asunto: "Bienvenido Administrador",
        mensajeTexto: `Hola, Felicidades! Ya eres Administrador de nuestra aplicación web Multi Aseguradoras NAR, tu contraseña para ingresar será: ${nuevaContrasena}, una vez dentro puedes cambiarla.`,
        mensajeHTML: `<p>Hola, Felicidades! Ya eres Administrador de nuestra aplicación web Multi Aseguradoras NAR, tu contraseña para ingresar será: <strong>${nuevaContrasena}</strong>, una vez dentro puedes cambiarla.</p>`
    }),
    bienvenidoAgente: (usuario) => ({
        asunto: "Bienvenido Agente",
        mensajeTexto: `Hola, Felicidades! Ya eres agente, tu contraseña es la misma para ingresar a la plataforma, una vez dentro puedes cambiar tu contraseña para que sea más segura, mucho éxito!`,
        mensajeHTML: `<p>Hola, Felicidades! Ya eres agente, tu contraseña es la misma para ingresar a la plataforma, una vez dentro puedes cambiar tu contraseña para que sea más segura, mucho éxito!</p>`
    }),
    bienvenidoPostulante: (usuario, nuevaContrasena) => ({
        asunto: "Bienvenido Postulante",
        mensajeTexto: `Hola, Felicidades! Haz pasado el primer filtro. Utiliza la siguiente contraseña para ingresar y enviar todos tus documentos: ${nuevaContrasena}`,
        mensajeHTML: `<p>Hola, Felicidades! Haz pasado el primer filtro. Utiliza la siguiente contraseña para ingresar y enviar todos tus documentos: <strong>${nuevaContrasena}</strong></p>`
    }),
    documentoRechazadoDomicilio: (usuario) => ({
        asunto: "Documento Rechazado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que tu documento "Comprobante de domicilio" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.`,
        mensajeHTML: `<p>Hola ${usuario}, lamentamos informarte que tu documento "Comprobante de domicilio" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.</p>`
    }),
    documentoRechazadoIdentificacion: (usuario) => ({
        asunto: "Documento Rechazado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que tu documento "Identificación oficial" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.`,
        mensajeHTML: `<p>Hola ${usuario}, lamentamos informarte que tu documento "Identificación oficial" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.</p>`
    }),
    documentoRechazadoAfiliacion: (usuario) => ({
        asunto: "Documento Rechazado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que tu documento "Documento de afiliación" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.`,
        mensajeHTML: `<p>Hola ${usuario}, lamentamos informarte que tu documento "Documento de afiliación" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.</p>`
    }),
    documentoRechazadoCaratula: (usuario) => ({
        asunto: "Documento Rechazado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que tu documento "Carátula de banco" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.`,
        mensajeHTML: `<p>Hola ${usuario}, lamentamos informarte que tu documento "Carátula de banco" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.</p>`
    }),
    documentoRechazadoConstancia: (usuario) => ({
        asunto: "Documento Rechazado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que tu documento "Constancia de situación fiscal" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.`,
        mensajeHTML: `<p>Hola ${usuario}, lamentamos informarte que tu documento "Constancia de situación fiscal" ha sido rechazado. Sube lo antes posible nuevamente tu documento, se habilitará solo ese campo en tu pestaña para que lo puedas subir.</p>`
    }),
    emisionPoliza: (usuario, detallesPoliza) => ({
        asunto: "Emisión de Póliza",
        mensajeTexto: `Hola ${usuario}, tu póliza ha sido emitida. Detalles: ${detallesPoliza}`,
        mensajeHTML: `<p>Hola ${usuario}, tu póliza ha sido emitida. Detalles: <strong>${detallesPoliza}</strong></p>`
    }),
    usuarioInactivadoPorCuota: (usuario) => ({
        asunto: "Usuario Inactivado",
        mensajeTexto: `Hola ${usuario}, lamentamos informarte que has sido inactivado debido a que no cumpliste con la cuota mensual, te sugerimos entrar a nuestra página e iniciar sesión con tu cuenta para solicitar tu reactivación.`,
        mensajeHTML: `<p>Hola ${usuario}, lamentamos informarte que has sido inactivado debido a que no cumpliste con la cuota mensual, te sugerimos entrar a nuestra página e iniciar sesión con tu cuenta para solicitar tu reactivación.</p>`
    })
};

class EmailService {
    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async enviarCorreo(destinatario, tipoCorreo, datosCorreo) {
        const plantilla = plantillas[tipoCorreo](datosCorreo.usuario, datosCorreo.detalle);

        const opcionesCorreo = {
            to: destinatario,
            from: 'nar.multiaseguradora@gmail.com',
            subject: plantilla.asunto,
            text: plantilla.mensajeTexto,
            html: plantilla.mensajeHTML
        };

        try {
            await sgMail.send(opcionesCorreo);
            console.log("Correo enviado exitosamente.");
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            throw new Error("Error al enviar el correo: " + error.message);
        }
    }
}

module.exports = new EmailService();
