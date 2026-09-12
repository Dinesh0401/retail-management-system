import express from 'express';
import healthRoutes from './routes/healthRoutes';
import productRoutes from './routes/productRoutes';
import branchRoutes from './routes/branchRoutes';

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Register routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/branches', branchRoutes);

export default app;
