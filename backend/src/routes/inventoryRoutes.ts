import { Router } from 'express';
import { getInventoryHandler, updateInventoryHandler } from '../controllers/inventoryController';

const router = Router();

router.get('/', getInventoryHandler);
router.put('/:id', updateInventoryHandler);

export default router;
