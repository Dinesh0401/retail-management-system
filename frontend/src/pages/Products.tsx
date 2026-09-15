import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Product } from '../types/api';

interface ProductsProps {
  onNavigate?: (path: string) => void;
}

function Products({ onNavigate }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<string>('electronics');
  const [unitPrice, setUnitPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
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
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}" (${product.sku})?`)) {
      return;
    }
    try {
      setSubmitting(true);
      await api.deleteProduct(product.id);
      setSuccess(`Product "${product.name}" deleted successfully!`);
      setError(null);
      if (isEditing === product.id) {
        resetForm();
      }
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!sku.trim()) {
      setError('SKU is required');
      return;
    }
    const parsedUnitPrice = Number(unitPrice);
    const parsedCostPrice = Number(costPrice);

    if (isNaN(parsedUnitPrice) || parsedUnitPrice < 0) {
      setError('Unit price must be a valid non-negative number');
      return;
    }
    if (isNaN(parsedCostPrice) || parsedCostPrice < 0) {
      setError('Cost price must be a valid non-negative number');
      return;
    }

    const payload = {
      name: name.trim(),
      sku: sku.trim(),
      category,
      unit_price: parsedUnitPrice,
      cost_price: parsedCostPrice,
    };

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.updateProduct(isEditing, payload);
        setSuccess(`Product "${payload.name}" updated successfully!`);
      } else {
        await api.createProduct(payload);
        setSuccess(`Product "${payload.name}" created successfully!`);
      }
      resetForm();
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="crud-container">
      {/* Top Header & Navigation */}
      <div className="crud-header">
        <div>
          <div className="crud-badge">Inventory Management</div>
          <h1 className="crud-title">Products Directory (CRUD)</h1>
          <p className="crud-subtitle">
            Create, view, edit, and delete products in the central database.
          </p>
        </div>
        <button
          type="button"
          className="back-btn"
          onClick={() => onNavigate ? onNavigate('/') : (window.location.pathname = '/')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* State Feedback Banners */}
      {error && (
        <div className="alert-banner alert-banner-error">
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
          <button type="button" className="alert-close-btn" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {success && (
        <div className="alert-banner alert-banner-success">
          <div className="alert-content">
            <span className="alert-icon">✅</span>
            <span>{success}</span>
          </div>
          <button type="button" className="alert-close-btn" onClick={() => setSuccess(null)}>✕</button>
        </div>
      )}

      {/* Product Form Card (Add / Edit) */}
      <div className="crud-card form-card">
        <div className="form-card-header">
          <h2>{isEditing ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          {isEditing && (
            <span className="editing-indicator">Editing Mode</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="prod-name">Product Name *</label>
              <input
                id="prod-name"
                type="text"
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-sku">SKU Code *</label>
              <input
                id="prod-sku"
                type="text"
                placeholder="e.g. ELEC-005"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-category">Category *</label>
              <select
                id="prod-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
              >
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="grocery">Grocery</option>
                <option value="household">Household</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prod-unit-price">Unit Price (Selling) ₹ *</label>
              <input
                id="prod-unit-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 2999"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-cost-price">Cost Price (Purchase) ₹ *</label>
              <input
                id="prod-cost-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1850"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? '💾 Update Product' : '➕ Add Product'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List Card */}
      <div className="crud-card list-card">
        <div className="list-card-header">
          <div className="list-title-area">
            <h2>Product Catalog</h2>
            <span className="count-badge">{filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'}</span>
          </div>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="crud-loading-state">
            <div className="loading-spinner"></div>
            <p>Loading products catalog from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="crud-empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>{searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first product using the form above.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Cost Price</th>
                  <th style={{ textAlign: 'right' }}>Gross Margin</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const margin = product.unit_price - product.cost_price;
                  const marginPct = product.unit_price > 0 ? ((margin / product.unit_price) * 100).toFixed(0) : '0';
                  const isCurrentEditing = isEditing === product.id;

                  return (
                    <tr key={product.id} className={isCurrentEditing ? 'row-editing' : ''}>
                      <td>
                        <div className="product-cell-name">{product.name}</div>
                        <div className="product-cell-id">ID: {product.id.slice(0, 8)}...</div>
                      </td>
                      <td>
                        <span className="sku-code">{product.sku}</span>
                      </td>
                      <td>
                        <span className={`category-pill cat-${product.category?.toLowerCase() || 'other'}`}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {formatCurrency(product.unit_price)}
                      </td>
                      <td style={{ textAlign: 'right', color: '#666' }}>
                        {formatCurrency(product.cost_price)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`margin-badge ${margin >= 0 ? 'margin-pos' : 'margin-neg'}`}>
                          {formatCurrency(margin)} ({marginPct}%)
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          <button
                            type="button"
                            className="action-btn action-edit"
                            onClick={() => handleEditClick(product)}
                            title="Edit product"
                            disabled={submitting}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn action-delete"
                            onClick={() => handleDelete(product)}
                            title="Delete product"
                            disabled={submitting}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;