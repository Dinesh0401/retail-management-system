import { Router } from 'express';
import { getStockMovementsHandler } from '../controllers/stockMovementController';

const router = Router();

router.get('/', getStockMovementsHandler);

export default router;
