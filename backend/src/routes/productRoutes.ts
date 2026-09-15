import { Router } from 'express';
import { 
  getProductsHandler, 
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler
} from '../controllers/productController';

const router = Router();

router.get('/', getProductsHandler);
router.get('/:id', getProductByIdHandler);
router.post('/', createProductHandler);
router.put('/:id', updateProductHandler);
router.delete('/:id', deleteProductHandler);

export default router;
