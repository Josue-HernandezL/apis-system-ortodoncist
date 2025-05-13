import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyAccesKey } from './middleware/auth.js';
import pacientesRoutes from './routes/pacientes.js';
import citasRoutes from './routes/citas.js';
import inventarioRoutes from './routes/inventario.js';
import pagosRoutes from './routes/pagos.js';
import auth from './routes/authUser.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/pacientes', verifyAccesKey, pacientesRoutes);
app.use('/api/citas', verifyAccesKey, citasRoutes);
app.use('/api/inventario', verifyAccesKey, inventarioRoutes);
app.use('/api/pagos', verifyAccesKey, pagosRoutes);
app.use('/api/auth', auth);

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
