import { Router } from 'express';
import { getProductsHandler } from '../controllers/productController';

const router = Router();

router.get('/', getProductsHandler);

export default router;
