const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importar el paquete cors
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const UsuarioService = require('./services/usuario.service');
const UsuarioRepository = require('./repositories/usuario.repository');
const aseguradorasRoutes = require('./routes/aseguradora.routes');
const clientesRoutes = require('./routes/cliente.routes');
const aseguradosRoutes = require('./routes/asegurado.routes');
const usuariosRoutes = require('./routes/usuario.routes');
const segurosRoutes = require('./routes/seguro.routes');
const cotizacionesRoutes = require('./routes/cotizacion.routes');
const emisionesRoutes = require('./routes/emision.routes');
const comprobanteDomicilio = require('./routes/documentos_personas.routes');
const cuotasMensualesRoutes = require('./routes/cuotaMensual.routes');
const comprobanteFiscal = require('./routes/documentos_persona_constancia_fiscal.routes');
const identificacionOficial = require('./routes/documentos_persona_identificacion.routes');
const caratulaBanco = require('./routes/documentos_persona_caratula_banco.routes');
const documentoAfiliacion = require('./routes/documentos_persona_documento_afiliacion.routes');

const App = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://staging.d2g7u9oponhw6t.amplifyapp.com",
  "192.168.100.15" // Agregado para permitir acceso desde esta IP
];

const corsOptions = {
    origin: function (origin, callback) {
      // Permitir peticiones sin origin (como curl o Postman) o desde orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No autorizado por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  
  // Usar CORS en tu app
  App.use(cors(corsOptions));

App.use(bodyParser.json());
App.use(fileUpload());

App.use('/nar/aseguradoras', aseguradorasRoutes);
App.use('/nar/clientes', clientesRoutes);
App.use('/nar/asegurados', aseguradosRoutes);
App.use('/nar/usuarios', usuariosRoutes);
App.use('/nar/seguros', segurosRoutes);
App.use('/nar/cotizaciones', cotizacionesRoutes);
App.use('/nar/emisiones', emisionesRoutes);
App.use('/nar/comprobanteDomicilio', comprobanteDomicilio);
App.use('/nar/constanciaFiscal', comprobanteFiscal);
App.use('/nar/identificacionOficial', identificacionOficial);
App.use('/nar/caratulaBanco', caratulaBanco);
App.use('/nar/documentoAfiliacion', documentoAfiliacion);
App.use('/nar/cuotas', cuotasMensualesRoutes);

// Programar la tarea cron
cron.schedule('0 0 1 * *', async () => {
    const usuarios = await UsuarioRepository.getAllUsuarios();
    for (const usuario of usuarios) {
        if (usuario.rol === 'agente') {
            await UsuarioService.updateUsuarioStatusInactiveRolAgente(usuario._id);
        }
    }
});

// mongodb+srv://20233tn143:5yZYXxMXa6998s1H@mongazo1.yez4y.mongodb.net/?retryWrites=true&w=majority&appName=Mongazo1'
mongoose.connect('mongodb+srv://20233tn143:5yZYXxMXa6998s1H@mongazo1.yez4y.mongodb.net/app-nar-db?retryWrites=true&w=majority&appName=Mongazo1')
    .then(() => {
        console.log('Conexión exitosa a la base de datos a MongoDB');
        App.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
    })
    .catch((err) => console.log('Error al conectar en MongoDB', err));

/**
 * ¿Y dónde estás tú?
Aún tengo el tattoo, mientras tú tapaste con un fuck you el mío
No dejo dormir a los pinches vecinos
Con los tragos lloro, con un polvo me río

Y yo seguiré siendo un desmadre
Tú tendrás tu familia, pa' mí será tarde
Pidiendo otra onza, pidiendo más vino
Tú querías tus hijos, pero no conmigo
 */