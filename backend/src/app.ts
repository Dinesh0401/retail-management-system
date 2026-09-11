import express from 'express';
import healthRoutes from './routes/healthRoutes';

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Register routes
app.use('/api/health', healthRoutes);

export default app;
