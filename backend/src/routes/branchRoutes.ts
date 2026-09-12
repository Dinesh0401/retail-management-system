import { Router } from 'express';
import { getBranchesHandler } from '../controllers/branchController';

const router = Router();

router.get('/', getBranchesHandler);

export default router;
