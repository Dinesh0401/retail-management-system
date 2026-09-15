import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Product } from '../types/api';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<any>('electronics');
  const [unitPrice, setUnitPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setSku('');
    setCategory('electronics');
    setUnitPrice('');
    setCostPrice('');
    setIsEditing(null);
  };

  const handleEditClick = (product: Product) => {
    setName(product.name);
    setSku(product.sku);
    setCategory(product.category);
    setUnitPrice(product.unit_price.toString());
    setCostPrice(product.cost_price.toString());
    setIsEditing(product.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      await fetchProducts(); // refresh list
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !sku || !unitPrice || !costPrice) {
      setError('Please fill in all required fields');
      return;
    }

    const payload = {
      name,
      sku,
      category,
      unit_price: Number(unitPrice),
      cost_price: Number(costPrice)
    };

    try {
      if (isEditing) {
        await api.updateProduct(isEditing, payload);
      } else {
        await api.createProduct(payload);
      }
      resetForm();
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="products-page" style={{ padding: '2rem' }}>
      <h1>Products Management</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form className="product-form" onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="grocery">Grocery</option>
          <option value="household">Household</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Unit Price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Cost Price"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
        />
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div className="product-list" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Unit Price:</strong> ${product.unit_price}</p>
            <p><strong>Cost Price:</strong> ${product.cost_price}</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEditClick(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)} style={{ background: '#ff4444', color: 'white' }}>Delete</button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}

export default Products;