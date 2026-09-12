import { Request, Response } from 'express';
import { getProducts } from '../services/productService';

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve products from database',
    });
  }
};
