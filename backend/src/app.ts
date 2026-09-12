import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
import productRoutes from './routes/productRoutes';
import branchRoutes from './routes/branchRoutes';
import saleRoutes from './routes/saleRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import stockMovementRoutes from './routes/stockMovementRoutes';
import salesAnalysisRoutes from './routes/salesAnalysisRoutes';
import inventoryIntelligenceRoutes from './routes/inventoryIntelligenceRoutes';
import decisionImpactRoutes from './routes/decisionImpactRoutes';

const app = express();

// Configure CORS
app.use(cors({
  origin: "http://localhost:5173"
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Register routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/sales-analysis', salesAnalysisRoutes);
app.use('/api/inventory-intelligence', inventoryIntelligenceRoutes);
app.use('/api/decision-impact', decisionImpactRoutes);

export default app;
