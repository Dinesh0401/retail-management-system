import { Router } from 'express';
import { getInventoryIntelligenceHandler } from '../controllers/inventoryIntelligenceController';

const router = Router();

router.get('/', getInventoryIntelligenceHandler);

export default router;
