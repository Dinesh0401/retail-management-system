import { Request, Response } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { CreateProductInput, UpdateProductInput } from '../types/product';

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve products' });
  }
};

export const getProductByIdHandler = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve product' });
  }
};

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const { name, sku, category, unit_price, cost_price } = req.body;

    // Validation
    if (!name || name.trim() === '') return res.status(400).json({ success: false, error: 'Name is required' });
    if (!sku || sku.trim() === '') return res.status(400).json({ success: false, error: 'SKU is required' });
    if (!category) return res.status(400).json({ success: false, error: 'Category is required' });
    if (unit_price === undefined || unit_price <= 0) return res.status(400).json({ success: false, error: 'Unit price must be > 0' });
    if (cost_price === undefined || cost_price <= 0) return res.status(400).json({ success: false, error: 'Cost price must be > 0' });

    const input: CreateProductInput = { name, sku, category, unit_price, cost_price };
    const product = await createProduct(input);
    
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === '23505') { // Unique violation for SKU in Postgres
      return res.status(400).json({ success: false, error: 'A product with this SKU already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, sku, category, unit_price, cost_price } = req.body;

    // Validation
    if (name !== undefined && name.trim() === '') return res.status(400).json({ success: false, error: 'Name cannot be empty' });
    if (sku !== undefined && sku.trim() === '') return res.status(400).json({ success: false, error: 'SKU cannot be empty' });
    if (unit_price !== undefined && unit_price <= 0) return res.status(400).json({ success: false, error: 'Unit price must be > 0' });
    if (cost_price !== undefined && cost_price <= 0) return res.status(400).json({ success: false, error: 'Cost price must be > 0' });

    // Check if product exists
    const existing = await getProductById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const input: UpdateProductInput = { name, sku, category, unit_price, cost_price };
    
    // Clean undefined fields so they aren't sent to Supabase
    Object.keys(input).forEach(key => input[key as keyof UpdateProductInput] === undefined && delete input[key as keyof UpdateProductInput]);

    const product = await updateProduct(id, input);
    res.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === '23505') { 
      return res.status(400).json({ success: false, error: 'A product with this SKU already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existing = await getProductById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await deleteProduct(id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === '23503') { // Foreign key violation
       return res.status(400).json({ success: false, error: 'Cannot delete product because it has associated sales or inventory records.' });
    }
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
