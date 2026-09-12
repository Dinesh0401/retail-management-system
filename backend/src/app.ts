import express from 'express';
import healthRoutes from './routes/healthRoutes';
import productRoutes from './routes/productRoutes';

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Register routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);

export default app;
