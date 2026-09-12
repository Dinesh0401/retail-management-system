import { Router } from 'express';
import { getSalesAnalysisHandler } from '../controllers/salesAnalysisController';

const router = Router();

router.get('/', getSalesAnalysisHandler);

export default router;
