import { Router } from 'express';
import { getSalesHandler } from '../controllers/saleController';

const router = Router();

router.get('/', getSalesHandler);

export default router;
