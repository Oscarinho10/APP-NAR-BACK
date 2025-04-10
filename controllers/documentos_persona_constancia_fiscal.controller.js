const DocumentosPersonaService = require('../services/documentos_persona_constancia_fiscal.service');
const DocumentosRepository = require('../repositories/documentos_persona_constancia_fiscal.repository');
const PersonaRepository = require('../repositories/usuario.repository');
const EmailService = require("../services/email.service");
const { getGFS } = require('../config/gridfs');
const mongoose = require('mongoose');

class DocumentosPersonaController {

    async createDocumentoPersonaComprobanteDomicilio(req, res) {
        console.log(req.body);
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No se subieron archivos.');
        }

        const files = req.files.archivo;
        const filesArray = Array.isArray(files) ? files : [files];

        const uploadFile = (file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = getGFS().openUploadStream(
                    file.name, {
                    chunkSizeBytes: 1048576,
                    metadata: { contentType: file.mimetype }
                });

                const buffer = file.data;
                uploadStream.write(buffer);
                uploadStream.end();

                uploadStream.on('finish', () => {
                    resolve({
                        message: 'Archivo subido correctamente',
                        fileId: uploadStream.id,
                        fileName: uploadStream.filename
                    });
                });

                uploadStream.on('error', (err) => {
                    reject(err);
                });
            });
        };

        try {
            const idFiles = await Promise.all(filesArray.map(file => uploadFile(file)));
            const resp = [];
            for (const fileX of idFiles) {
                const idDocumentoGuardado = fileX.fileId;
                const nombreDocumentoGuardado = fileX.fileName;

                const idUsuario = req.body.idUsuario;
                if (!idUsuario) {
                    throw new Error('El id del usuario es requerido');
                }

                try {
                    const documentoPersonaCreado = await DocumentosPersonaService.createDocumentoPersonaComprobanteDomicilio(idUsuario, idDocumentoGuardado, nombreDocumentoGuardado);
                    resp.push(documentoPersonaCreado);
                } catch (error) {
                    console.error(`Error al crear el documento para el usuario ${idUsuario}:`, error.message);
                    // Puedes agregar una respuesta de error específica si lo deseas
                    resp.push({ error: error.message });
                }
            }

            res.json(resp);
        } catch (error) {
            console.error('Error al subir los archivos:', error.message);
            res.status(500).send('Ocurrió un error al procesar los archivos.');
        }
    }

    async getEstadoDocumento(req, res) {
        try {
            const documentoId = req.params.id;
            if (!documentoId || documentoId == '' || documentoId == null || documentoId == undefined) {
                throw new Error('El id del documento es requerido');
            }

            const estado = await DocumentosPersonaService.getEstadoDocumento(documentoId);
            res.json({ estado });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async downloadFile(req, res) {
        try {
            const gfs = getGFS(); // Obtener instancia de GridFS
            const fileId = new mongoose.Types.ObjectId(req.params.id);

            const file = await gfs.find({ _id: fileId }).toArray();
            if (!file || file.length === 0) {
                return res.status(404).json({ error: 'Archivo no encontrado' });
            }

            res.set('Content-Type', file[0].metadata.contentType);
            gfs.openDownloadStream(fileId).pipe(res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // documentos_persona.controller.js
    // documentos_persona.controller.js
    async deleteDocumentoPersonaComprobanteDomicilio(req, res) {
        try {
            const documentoId = req.params.id;
            if (!documentoId) {
                throw new Error('El id del documento es requerido');
            }

            const documento = await DocumentosRepository.getDocumentoComprobanteDomicilioById(documentoId);
            if (!documento) {
                throw new Error(`El documento con ID ${documentoId} no existe`);
            }

            const usuarioId = documento.idUsuario;

            const result = await DocumentosPersonaService.deleteDocumentoPersonaComprobanteDomicilio(documentoId);

            const usuario = await PersonaRepository.getUsuarioById(usuarioId);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }

            await EmailService.enviarCorreo(
                usuario.correo,
                "documentoRechazadoConstancia",
                { usuario: usuario.nombre }
            );

            res.json({ message: 'Documento eliminado correctamente y correo enviado al usuario', result });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateStatusAceptadoDocumentoPersonaDomicilio(req, res) {
        try {
            const documentoId = req.params.id;
            if (!documentoId || documentoId == '' || documentoId == null || documentoId == undefined) {
                throw new Error('El id del documento es requerido');
            }

            const documentoPersona = await DocumentosPersonaService.updateStatusAceptadoDocumentoPersonaDomicilio(documentoId);

            res.json(documentoPersona);

        } catch (error) {
            res.status(400).json({ message: error.message });

        }

    }

    async getDocumentoComprobanteDomicilioByPersonaId(req, res) {
        try {
            const idUsuario = req.params.id;
            if (!idUsuario || idUsuario == '' || idUsuario == null || idUsuario == undefined) {
                throw new Error('El id del usuario es requerido');
            }

            const documentosPersona = await DocumentosPersonaService.getDocumentoComprobanteDomicilioByPersonaId(idUsuario);

            res.json(documentosPersona);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }

    async getDocumentoComprobanteDomicilioById(req, res) {
        try {
            const idDocumento = req.params.id;
            if (!idDocumento || idDocumento == '' || idDocumento == null || idDocumento == undefined) {
                throw new Error('El id del usuario es requerido');
            }

            const documentosPersona = await DocumentosPersonaService.getDocumentoComprobanteDomicilioById(idDocumento);

            res.json(documentosPersona);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    }

    // async updateDocumentoPersonaComprobanteDomicilio(req, res) {
    //     try {
    //         const documentoAnteriorId = req.params.id;
    //         const nuevoDocumentoId = req.body.nuevoIdDocumento;

    //         if (!documentoAnteriorId || !nuevoDocumentoId) {
    //             throw new Error('Se requieren el ID del documento anterior y el nuevo ID del documento');
    //         }

    //         const resultado = await DocumentosPersonaService.updateDocumentoPersonaComprobanteDomicilio(documentoAnteriorId, nuevoDocumentoId);

    //         res.json({ message: 'Documento actualizado correctamente', resultado });
    //     } catch (error) {
    //         res.status(400).json({ message: error.message });
    //     }
    // }


}

module.exports = new DocumentosPersonaController();
