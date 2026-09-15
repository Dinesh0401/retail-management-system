import request from 'supertest';
import app from '../app';
import * as productService from '../services/productService';
import { Product } from '../types/product';

// Mock the product service
jest.mock('../services/productService');

const mockedProductService = productService as jest.Mocked<typeof productService>;

describe('Product API CRUD', () => {
  const mockProduct: Product = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    sku: 'TEST-123',
    category: 'electronics',
    unit_price: 100,
    cost_price: 50,
    created_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      mockedProductService.getProducts.mockResolvedValue([mockProduct]);
      
      const res = await request(app).get('/api/products');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Test Product');
    });
  });

  describe('POST /api/products', () => {
    it('should create a product and return 201', async () => {
      mockedProductService.createProduct.mockResolvedValue(mockProduct);
      
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          sku: 'TEST-123',
          category: 'electronics',
          unit_price: 100,
          cost_price: 50
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(mockProduct.id);
    });

    it('should return 400 for invalid input (missing name)', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          sku: 'TEST-123',
          category: 'electronics',
          unit_price: 100,
          cost_price: 50
        });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Name is required');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product and return 200', async () => {
      mockedProductService.getProductById.mockResolvedValue(mockProduct);
      mockedProductService.updateProduct.mockResolvedValue({ ...mockProduct, name: 'Updated Name' });
      
      const res = await request(app)
        .put(`/api/products/${mockProduct.id}`)
        .send({ name: 'Updated Name' });
      
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Updated Name');
    });

    it('should return 404 for non-existent product', async () => {
      mockedProductService.getProductById.mockResolvedValue(null);
      
      const res = await request(app)
        .put('/api/products/non-existent-id')
        .send({ name: 'Updated Name' });
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product and return 200', async () => {
      mockedProductService.getProductById.mockResolvedValue(mockProduct);
      mockedProductService.deleteProduct.mockResolvedValue(undefined);
      
      const res = await request(app).delete(`/api/products/${mockProduct.id}`);
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product deleted successfully');
    });

    it('should return 404 when deleting a non-existent product', async () => {
      mockedProductService.getProductById.mockResolvedValue(null);
      
      const res = await request(app).delete('/api/products/non-existent-id');
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });
});
