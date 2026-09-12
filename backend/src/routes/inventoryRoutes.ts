import { Router } from 'express';
import { getInventoryHandler } from '../controllers/inventoryController';

const router = Router();

router.get('/', getInventoryHandler);

export default router;
