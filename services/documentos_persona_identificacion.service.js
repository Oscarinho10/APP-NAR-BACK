const DocumentosPersonaRepository = require('../repositories/documentos_persona_identificacion.repository');
const PersonaRepository = require('../repositories/usuario.repository');

class DocumentosPersonaService {
    // Crear un documento para un usuario
    async createDocumentoPersonaComprobanteDomicilio(idUsuario, idDocumento) {
        if (!idUsuario || !idDocumento) {
            throw new Error('Faltan parámetros necesarios para crear el documento');
        }

        // Verificar si ya existe un documento "Comprobante de Domicilio" para el usuario
        const documentoExistente = await DocumentosPersonaRepository.findOne({
            idUsuario: idUsuario,
            nombre: "Identificación oficial"
        });

        if (documentoExistente) {
            throw new Error('El usuario ya tiene una Identificación oficial registrada');
        }

        const documentoPersona = {
            nombre: "Identificación oficial",
            idUsuario: idUsuario,
            idDocumento: idDocumento,  // Verifica que el nombre del campo coincida con el modelo
        };

        return await DocumentosPersonaRepository.createDocumentoPersonaComprobanteDomicilio(documentoPersona);
    }

    async getEstadoDocumento(idDocumento) {
        if (!idDocumento) {
            throw new Error('El id del documento es requerido');
        }

        const documento = await DocumentosPersonaRepository.getDocumentoComprobanteDomicilioById(idDocumento);
        if (!documento) {
            throw new Error(`El documento con ID ${idDocumento} no existe`);
        }

        return await DocumentosPersonaRepository.getEstadoDocumento(idDocumento);
    }
    
    // Actualizar el estado del documento
    // documentos_persona.service.js
    async deleteDocumentoPersonaComprobanteDomicilio(documentoId) {
        if (!documentoId) {
            throw new Error('El id del documento es requerido');
        }

        const documento = await DocumentosPersonaRepository.getDocumentoComprobanteDomicilioById(documentoId);
        if (!documento) {
            throw new Error(`El documento con ID ${documentoId} no existe`);
        }

        return await DocumentosPersonaRepository.deleteDocumentoPersonaComprobanteDomicilio(documentoId);
    }

    async updateStatusAceptadoDocumentoPersonaDomicilio(idDocumento) {
        if (!idDocumento) {
            throw new Error('El id del documento es requerido');
        }

        // Validar que el documento exista
        const documento = await DocumentosPersonaRepository.getDocumentoComprobanteDomicilioById(idDocumento);
        if (!documento) {
            throw new Error(`El documento con ID ${idDocumento} no existe`);
        }

        return await DocumentosPersonaRepository.updateStatusAceptadoDocumentoPersonaDomicilio(idDocumento);
    }

    // Obtener los documentos de un usuario por su ID
    async getDocumentoComprobanteDomicilioByPersonaId(idUsuario) {
        if (!idUsuario) {
            throw new Error('El id del usuario es requerido');
        }

        // Validar que el usuario exista
        const usuario = await PersonaRepository.getUsuarioById(idUsuario);
        if (!usuario) {
            throw new Error(`El usuario con ID ${idUsuario} no existe`);
        }

        return await DocumentosPersonaRepository.getDocumentoComprobanteDomicilioByPersonaId(idUsuario);
    }

    async getDocumentoComprobanteDomicilioById(idDocumento) {
        // Validar que el documento exista
        const documento = await DocumentosPersonaRepository.getDocumentoComprobanteDomicilioById(idDocumento);
        if (!documento) {
            throw new Error(`El documento con ID ${idDocumento} no existe`);
        }

        return documento;
    }

    // async updateDocumentoPersonaComprobanteDomicilio(documentoAnteriorId, nuevoDocumentoId) {
    //     if (!documentoAnteriorId || !nuevoDocumentoId) {
    //         throw new Error('Los IDs de los documentos son requeridos');
    //     }

    //     // Validar que el documento anterior exista
    //     const documento = await DocumentosPersonaRepository.getDocumentoComprobanteDomicilioById(documentoAnteriorId);
    //     if (!documento) {
    //         throw new Error(`El documento con ID ${documentoAnteriorId} no existe`);
    //     }

    //     return await DocumentosPersonaRepository.updateDocumentoPersonaComprobanteDomicilio(documentoAnteriorId, nuevoDocumentoId);
    // }

}

module.exports = new DocumentosPersonaService();
