const EmisionService = require("../services/emision.service");
const SeguroService = require("../services/seguro.service");
const AseguradoService = require("../services/asegurado.service");
const ClienteService = require("../services/cliente.service");
const cotizacionService = require("../services/cotizacion.service");

class EmisionController {
    async getAllEmisiones(req, res) {
        try {
            const emisiones = await EmisionService.getAllEmisiones();
            res.status(200).json(emisiones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEmisionById(req, res) {
        try {
            const emisionId = req.params.id;
    
            if (!emisionId) {
                throw new Error("El Id de la emisión es requerido");
            }
    
            // Obtener la emisión por su ID
            const emision = await EmisionService.getEmisionById(emisionId);
    
            if (!emision) {
                return res.status(404).json({ success: false, message: "Emisión no encontrada" });
            }
    
            // Obtener los datos del asegurado y el seguro relacionados con la emisión
            const asegurado = await AseguradoService.getAseguradoById(emision.idAsegurado);
            const seguro = await SeguroService.getSeguroById(emision.idSeguro);
            const cotizacion = await cotizacionService.getCotizacionById(emision.idCotizacion);
            const cliente = await ClienteService.getClienteById(emision.idCliente);
    
            // Si no se encuentran el asegurado o el seguro, devolver un error
            if (!asegurado || !seguro || !cotizacion || !cliente) {
                return res.status(404).json({ success: false, message: "Datos del asegurado o seguro no encontrados" });
            }
    
            // Construir la respuesta con los datos necesarios
            const emisionDetallada = {
                correoTitular: cliente.correo,
                nombreAsegurado: `${asegurado.nombre} ${asegurado.apellidoPaterno} ${asegurado.apellidoMaterno}`,
                rfc: asegurado.rfc,
                telefono: asegurado.telefono,
                edad: asegurado.edad,
                nombreSeguro: seguro.nombre,
                tipoSeguro: seguro.tipo,
                cobertura: seguro.cobertura,
                vigencia: `${emision.fechaInicio.toISOString().split('T')[0]} - ${emision.fechaVencimiento.toISOString().split('T')[0]}`,
                montoTotal: cotizacion.precioFinal,
            };
    
            return res.status(200).json({ 
                success: true, 
                message: "Emisión obtenida con éxito", 
                data: emisionDetallada 
            });
    
        } catch (error) {
            console.error("Error al obtener emisión:", error.message);
            return res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }
    

    async createEmision(req, res) {
        try {
            const nuevaEmision = await EmisionService.createEmision(req.body);
            res.status(201).json(nuevaEmision);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateEmision(req, res) {
        try {
            const emisionId = req.params.id;
            if (!emisionId) {
                throw new Error("El Id de la emisión es requerido");
            }
            const emisionActualizada = await EmisionService.updateEmision(emisionId, req.body);
            res.status(200).json(emisionActualizada);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEmisionByIdUsuario(req, res) {
        try {
            const idUsuario = req.params.idUsuario;
            if (!idUsuario) {
                throw new Error("El Id de usuario es requerido");
            }
            const emisiones = await EmisionService.getEmisionByIdUsuario(idUsuario);
            res.status(200).json(emisiones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEmisionesByCliente(req, res) {
        try {
            const { idCliente } = req.params;
    
            // Validar el parámetro
            if (!idCliente) {
                return res.status(400).json({ success: false, message: "El id del cliente es requerido" });
            }
    
            // Obtener las emisiones del cliente
            const emisiones = await EmisionService.getEmisionByIdCliente(idCliente);
    
            if (!emisiones || emisiones.length === 0) {
                return res.status(404).json({ success: false, message: "No se encontraron emisiones para este cliente" });
            }
    
            // Mapear las emisiones para agregar detalles del seguro
            const emisionesDetalladas = await Promise.all(
                emisiones.map(async (emision, index) => {
                    const seguro = await SeguroService.getSeguroById(emision.idSeguro);
                    const cliente = await ClienteService.getClienteById(emision.idCliente);
                    const cotizacion = await cotizacionService.getCotizacionById(emision.idCotizacion);
                    return {
                        idPoliza: emision.id,
                        cliente: cliente
                        ? `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`
                        : "Asegurado no encontrado",
                        numeroPoliza: index + 1, // Enumerar las pólizas
                        nombreSeguro: seguro?.nombre || "Seguro no encontrado",
                        vigencia: `${emision.fechaInicio.toISOString().split('T')[0]} - ${emision.fechaVencimiento.toISOString().split('T')[0]}`,
                        montoTotal: cotizacion.precioFinal
                    };
                })
            );
    
            // Responder con las emisiones detalladas
            return res.status(200).json({ 
                success: true, 
                message: "Emisiones obtenidas con éxito", 
                data: emisionesDetalladas 
            });
        } catch (error) {
            console.error("Error al obtener emisiones:", error.message);
            return res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }

    async getEmisionByIdAsegurado(req, res) {
        try {
            const idAsegurado = req.params.idAsegurado;
            if (!idAsegurado) {
                throw new Error("El Id de asegurado es requerido");
            }
            const emisiones = await EmisionService.getEmisionByIdAsegurado(idAsegurado);
            res.status(200).json(emisiones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEmisionByIdSeguro(req, res) {
        try {
            const idSeguro = req.params.idSeguro;
            if (!idSeguro) {
                throw new Error("El Id de seguro es requerido");
            }
            const emisiones = await EmisionService.getEmisionByIdSeguro(idSeguro);
            res.status(200).json(emisiones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getEmisionByIdCotizacion(req, res) {
        try {
            const idCotizacion = req.params.idCotizacion;
            if (!idCotizacion) {
                throw new Error("El Id de cotización es requerido");
            }
            const emisiones = await EmisionService.getEmisionByIdCotizacion(idCotizacion);
            res.status(200).json(emisiones);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getSeguroById(req, res) {
        try {
            //Validar que el Id venga en la petición
            const seguroId = req.params.id;
            if (!seguroId || seguroId == '' || seguroId == null || seguroId == undefined) {
                throw new Error('El Id del seguro es requerido');
            }
            const seguro = await EmisionService.getSeguroById(seguroId);
            res.json(seguro);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new EmisionController();
