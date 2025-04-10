const CotizacionService = require("../services/cotizacion.service");
const AseguradoService = require("../services/asegurado.service");
const SeguroService = require("../services/seguro.service");
const ClienteService = require("../services/cliente.service");
const clienteRepository = require("../repositories/cliente.repository");
const EmailService = require("../services/email.service");

class CotizacionController {
    async getAllCotizaciones(req, res) {
        try {
            const cotizaciones = await CotizacionService.getAllCotizaciones();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(cotizaciones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllCotizacionesPendientes(req, res) {
        try {
            const cotizaciones = await CotizacionService.getAllCotizacionesPendientes();
            // Por defecto siempre retorna 200 si no se le especifica el status
            // 200 -> éxito | OK 
            res.status(200).json(cotizaciones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllCotizacionesPendientesByIdAgente(req, res) {
        try {
            const { idUsuario } = req.params; // O req.body, dependiendo de cómo lo envíes

            if (!idUsuario) {
                return res.status(400).json({ message: "El ID del usuario es requerido." });
            }

            // Obtener todas las cotizaciones pendientes del agente
            const cotizaciones = await CotizacionService.getAllCotizacionesPendientesByIdAgente(idUsuario);

            if (!cotizaciones.length) {
                return res.status(200).json({ success: true, message: "No hay cotizaciones pendientes.", data: [] });
            }

            // Obtener detalles adicionales para cada cotización
            const cotizacionesDetalladas = await Promise.all(
                cotizaciones.map(async (cotizacion) => {
                    try {
                        const asegurado = await AseguradoService.getAseguradoById(cotizacion.idAsegurado);
                        const seguro = await SeguroService.getSeguroById(cotizacion.idSeguro);
                        const cliente = await ClienteService.getClienteById(cotizacion.idCliente);

                        if (!asegurado || !seguro || !cliente) {
                            return null;
                        }

                        return {
                            idCotizacion: cotizacion.id,
                            nombreCliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                            nombreAsegurado: `${asegurado.nombre} ${asegurado.apellidoPaterno} ${asegurado.apellidoMaterno}`,
                            nombreSeguro: seguro.nombre,
                            tipoSeguro: seguro.tipo,
                            cobertura: seguro.cobertura,
                            precioFinal: cotizacion.precioFinal,
                            fechaCotizacion: cotizacion.fechaCotizacion,
                        };
                    } catch (error) {
                        console.warn(`Error al procesar cotización ID ${cotizacion.id}:`, error.message);
                        return null;
                    }
                })
            );

            // Filtrar cotizaciones con información incompleta
            const cotizacionesFiltradas = cotizacionesDetalladas.filter((cot) => cot !== null);

            return res.status(200).json({
                success: true,
                message: "Cotizaciones obtenidas con éxito",
                data: cotizacionesFiltradas
            });

        } catch (error) {
            res.status(500).json({ message: "Error al obtener cotizaciones pendientes", error: error.message });
        }
    }

    async getAllCotizacionesPendientesByIdCliente(req, res) {
        try {
            const { idCliente } = req.params; // O req.body, dependiendo de cómo lo envíes

            if (!idCliente) {
                return res.status(400).json({ message: "El ID del cliente es requerido." });
            }

            // Obtener todas las cotizaciones pendientes del agente
            const cotizaciones = await CotizacionService.getAllCotizacionesPendientesByIdCliente(idCliente);

            if (!cotizaciones.length) {
                return res.status(200).json({ success: true, message: "No hay cotizaciones pendientes.", data: [] });
            }

            // Obtener detalles adicionales para cada cotización
            const cotizacionesDetalladas = await Promise.all(
                cotizaciones.map(async (cotizacion) => {
                    const asegurado = await AseguradoService.getAseguradoById(cotizacion.idAsegurado);
                    const seguro = await SeguroService.getSeguroById(cotizacion.idSeguro);
                    const cliente = await ClienteService.getClienteById(cotizacion.idCliente); // Se corrigió esta línea

                    if (!asegurado || !seguro || !cliente) {
                        return null; // Filtrar después si falta información
                    }

                    return {
                        idCotizacion: cotizacion.id,
                        nombreCliente: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
                        nombreAsegurado: `${asegurado.nombre} ${asegurado.apellidoPaterno} ${asegurado.apellidoMaterno}`,
                        nombreSeguro: seguro.nombre,
                        tipoSeguro: seguro.tipo,
                        cobertura: seguro.cobertura,
                        precioFinal: cotizacion.precioFinal,
                        fechaCotizacion: cotizacion.fechaCotizacion,
                    };
                })
            );

            // Filtrar cotizaciones con información incompleta
            const cotizacionesFiltradas = cotizacionesDetalladas.filter((cot) => cot !== null);

            return res.status(200).json({
                success: true,
                message: "Cotizaciones obtenidas con éxito",
                data: cotizacionesFiltradas
            });

        } catch (error) {
            res.status(500).json({ message: "Error al obtener cotizaciones pendientes", error: error.message });
        }
    }

    async getCotizacionById(req, res) {
        try {
            // Validar que el Id venga en la petición
            const cotizacionId = req.params.id;
            if (!cotizacionId || cotizacionId === '' || cotizacionId === null || cotizacionId === undefined) {
                return res.status(400).json({ message: 'El Id de la cotización es requerido' });
            }

            // Obtener la cotización por su ID
            const cotizacion = await CotizacionService.getCotizacionById(cotizacionId);

            // Si no se encuentra la cotización, responder con un error
            if (!cotizacion) {
                return res.status(404).json({ message: 'Cotización no encontrada' });
            }

            // Obtener detalles adicionales para la cotización
            const asegurado = await AseguradoService.getAseguradoById(cotizacion.idAsegurado);
            const seguro = await SeguroService.getSeguroById(cotizacion.idSeguro);
            const cliente = await ClienteService.getClienteById(cotizacion.idCliente);

            // Si falta alguna información, devolver un error
            if (!asegurado || !seguro || !cliente) {
                return res.status(404).json({ message: 'Faltan datos relacionados con la cotización' });
            }

            // Formatear los detalles para la respuesta
            const cotizacionDetallada = {
                idCotizacion: cotizacion.id,
                nombreSeguro: seguro.nombre,
                tipoSeguro: seguro.tipo,
                nombreAsegurado: `${asegurado.nombre} ${asegurado.apellidoPaterno} ${asegurado.apellidoMaterno}`,
                telefonoAsegurado: asegurado.telefono,
                edadAsegurado: asegurado.edad,
                correoAsegurado: asegurado.correo,
                cobertura: seguro.cobertura,
                precioFinal: cotizacion.precioFinal,
                fechaCotizacion: cotizacion.fechaCotizacion,
            };

            // Enviar la respuesta
            return res.status(200).json({
                success: true,
                message: 'Cotización obtenida con éxito',
                data: cotizacionDetallada,
            });

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la cotización', error: error.message });
        }
    }


    async createCotizacion(req, res) {
        try {
            const cotizacion = await CotizacionService.createCotizacion(req.body);
            res.json(cotizacion);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateCotizacion(req, res) {
        try {
            const cotizacionId = req.params.id;
            if (!cotizacionId || cotizacionId == '' || cotizacionId == null || cotizacionId == undefined) {
                throw new Error('El Id de la cotizacion es requerido');
            }

            const cotizacion = await CotizacionService.updateCotizacion(cotizacionId, req.body);
            res.json(cotizacion);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateCotizacionStatusEmitida(req, res) {
        try {
            const cotizacionId = req.params.id;
            const emisionData = req.body;

            const { emisionCreada, cliente, asegurado, seguro } = await CotizacionService.updateCotizacionStatusEmitida(cotizacionId, emisionData);

            const usuario = await clienteRepository.getClienteById(cliente.id);
            if (!usuario) throw new Error('Usuario no encontrado para enviar el correo');

            const detallesPoliza = `
                <h3 style="color: #E53935;">📌 Información del Seguro:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${seguro.nombre}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tipo:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${seguro.tipo}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Coberturas:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${seguro.cobertura}</td></tr>
                </table>

                <h3 style="color: #43A047;">👤 Información del Asegurado:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${asegurado.nombre} ${asegurado.apellidoPaterno} ${asegurado.apellidoMaterno}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Edad:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${asegurado.edad}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Correo:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${asegurado.correo}</td></tr>
                    <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${asegurado.telefono}</td></tr>
                </table>
            `;

            await EmailService.enviarCorreo(
                usuario.correo,
                "emisionPoliza",
                { usuario: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`, detalle: detallesPoliza }
            );

            res.status(200).json({
                success: true,
                message: "Póliza emitida correctamente y correo enviado.",
                data: emisionCreada,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCotizacionByIdUsuario(req, res) {
        try {
            const idUsuario = req.params.idUsuario;
            if (!idUsuario) {
                throw new Error('El Id de usuario es requerido');
            }
            const cotizaciones = await CotizacionService.getCotizacionByIdUsuario(idUsuario);
            res.status(200).json(cotizaciones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCotizacionByIdCliente(req, res) {
        try {
            const idCliente = req.params.idCliente;
            if (!idCliente) {
                throw new Error('El Id de cliente es requerido');
            }
            const cotizaciones = await CotizacionService.getCotizacionByIdCliente(idCliente);
            res.status(200).json(cotizaciones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCotizacionByIdAsegurado(req, res) {
        try {
            const idAsegurado = req.params.idAsegurado;
            if (!idAsegurado) {
                throw new Error('El Id de asegurado es requerido');
            }
            const cotizaciones = await CotizacionService.getCotizacionByIdAsegurado(idAsegurado);
            res.status(200).json(cotizaciones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCotizacionByIdSeguro(req, res) {
        try {
            const idSeguro = req.params.idSeguro;
            if (!idSeguro) {
                throw new Error('El Id de seguro es requerido');
            }
            const cotizaciones = await CotizacionService.getCotizacionByIdSeguro(idSeguro);
            res.status(200).json(cotizaciones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CotizacionController();
