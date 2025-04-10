const DocumentosPersona = require('../models/documentos_persona.model');

class DocumentoPersonaComprobanteDomicilioRepository {
    // Crear un nuevo documento para una persona
    async createDocumentoPersonaComprobanteDomicilio(documentosPersona) {
        try {
            return await DocumentosPersona.create(documentosPersona);
        } catch (error) {
            throw new Error('Error al crear el documento: ' + error.message);
        }
    }

    // Obtener un documento por su ID
    async getDocumentoComprobanteDomicilioById(id) {
        try {
            return await DocumentosPersona.findOne({ idDocumento: id }); // Usamos 'idDocumento' en lugar de 'documentoId'
        } catch (error) {
            throw new Error('Error al obtener el documento por ID: ' + error.message);
        }
    }

    async getEstadoDocumento(idDocumento) {
        try {
            const documento = await DocumentosPersona.findOne({ idDocumento: idDocumento });
            if (!documento) {
                throw new Error(`No se encontró el documento con ID ${idDocumento}`);
            }
            return documento.estado;
        } catch (error) {
            throw new Error('Error al obtener el estado del documento: ' + error.message);
        }
    }

    async findOne(query) {
        try {
            return await DocumentosPersona.findOne(query);
        } catch (error) {
            throw new Error('Error al buscar el documento: ' + error.message);
        }
    }

    // Actualizar el estado de un documento por su ID
    async deleteDocumentoPersonaComprobanteDomicilio(idDocumento) {
        try {
            const doc = await DocumentosPersona.findOne({ idDocumento: idDocumento });
            if (!doc) {
                throw new Error(`El documento con ID ${idDocumento} no existe`);
            }

            return await DocumentosPersona.deleteOne({ idDocumento: idDocumento });
        } catch (error) {
            throw new Error('Error al eliminar el documento: ' + error.message);
        }
    }

    async updateStatusAceptadoDocumentoPersonaDomicilio(idDocumento) {
        try {
            const result = await DocumentosPersona.updateOne(
                { idDocumento: idDocumento }, // Usamos 'idDocumento' en lugar de 'documentoId'
                { $set: { estado: 'aceptado' } }
            );
            return result;
        } catch (error) {
            throw new Error('Error al actualizar el estado del documento: ' + error.message);
        }
    }

    // Obtener los documentos de una persona por su ID
    async getDocumentoComprobanteDomicilioByPersonaId(idUsuario) {
        try {
            return await DocumentosPersona.find({
                idUsuario: idUsuario,
                nombre: "Constancia de situación fiscal"
            });
        } catch (error) {
            throw new Error('Error al obtener documentos por ID de usuario: ' + error.message);
        }
    }

    // async updateDocumentoPersonaComprobanteDomicilio(documentoAnteriorId, nuevoIdDocumento) {
    //     try {
    //         const result = await DocumentosPersona.updateOne(
    //             { idDocumento: documentoAnteriorId }, // Documento anterior
    //             { 
    //                 $set: { 
    //                     idDocumento: nuevoIdDocumento, 
    //                     estado: 'pendiente',
    //                     fechaActualizacion: new Date()
    //                 }                     
    //             }
    //         );
    //         return result;
    //     } catch (error) {
    //         throw new Error('Error al actualizar el documento: ' + error.message);
    //     }
    // }

}

module.exports = new DocumentoPersonaComprobanteDomicilioRepository();
