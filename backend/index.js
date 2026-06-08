import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Importación de rutas...
import pacientesRoutes from './routes/pacienteRoutes.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();

// Middlewares globales de seguridad y utilidades
app.use(helmet()); // Seguridad HTTP
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging de peticiones

// Limitador de peticiones (100 peticiones cada 15 min por IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde." }
});
app.use(limiter);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', authenticate, pacientesRoutes);
app.use('/api/citas', authenticate, citaRoutes);
app.use('/api/inventario', authenticate, inventarioRoutes);
app.use('/api/pagos', authenticate, pagoRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Ocurrió un error interno en el servidor.',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
