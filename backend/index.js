import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pacientesRoutes from './routes/pacienteRoutes.js';
import citaRoutes from './routes/citaRoutes.js';
import inventarioRoutes from './routes/inventarioRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/pacientes', pacientesRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/pagos', pagoRoutes);

app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
