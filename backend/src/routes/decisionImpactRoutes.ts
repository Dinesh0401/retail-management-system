import { Router } from 'express';
import { getDecisionImpactHandler } from '../controllers/decisionImpactController';

const router = Router();

router.get('/', getDecisionImpactHandler);

export default router;
