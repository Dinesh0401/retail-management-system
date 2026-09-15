import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Product } from '../types/api';
import ProductForm, { type ProductFormData } from '../components/ProductForm';

const initialForm: ProductFormData = { name: '', sku: '', category: 'electronics', unit_price: '', cost_price: '' };

export default function Products({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(initialForm);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProducts(await api.getProducts());
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const resetForm = () => { setForm(initialForm); setEditId(null); };

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, sku: p.sku, category: p.category, unit_price: String(p.unit_price), cost_price: String(p.cost_price) });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      setSaving(true);
      await api.deleteProduct(id);
      setSuccess(`Product "${name}" was deleted successfully.`);
      setError(null);
      if (editId === id) resetForm();
      await loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.sku.trim()) return setError('Product Name and SKU are required.');
    const unitPrice = Number(form.unit_price), costPrice = Number(form.cost_price);
    if (isNaN(unitPrice) || unitPrice < 0 || isNaN(costPrice) || costPrice < 0) {
      return setError('Unit Price and Cost Price must be valid non-negative numbers.');
    }

    const payload = { name: form.name.trim(), sku: form.sku.trim(), category: form.category, unit_price: unitPrice, cost_price: costPrice };

    try {
      setSaving(true);
      if (editId) {
        await api.updateProduct(editId, payload);
        setSuccess(`Product "${payload.name}" updated successfully!`);
      } else {
        await api.createProduct(payload);
        setSuccess(`Product "${payload.name}" created successfully!`);
      }
      resetForm();
      await loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <div>
          <h2>Products Directory (CRUD)</h2>
          <p>Create, update, view, and delete retail inventory products</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => (onNavigate ? onNavigate('/') : (window.location.pathname = '/'))}>
          ← Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-error"><span>⚠️ {error}</span><button type="button" onClick={() => setError(null)}>✕</button></div>}
      {success && <div className="alert alert-success"><span>✅ {success}</span><button type="button" onClick={() => setSuccess(null)}>✕</button></div>}

      <ProductForm
        form={form}
        isEditing={Boolean(editId)}
        saving={saving}
        onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <div className="card">
        <h3>Catalog Products ({products.length})</h3>
        {loading ? (
          <p>Loading products catalog from database...</p>
        ) : products.length === 0 ? (
          <p>No products found. Add a product above.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th><th>SKU</th><th>Category</th><th>Unit Price</th><th>Cost Price</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><code>{p.sku}</code></td>
                    <td><span className="badge">{p.category}</span></td>
                    <td>₹{p.unit_price}</td>
                    <td>₹{p.cost_price}</td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline" onClick={() => handleEdit(p)} disabled={saving}>✏️ Edit</button>{' '}
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id, p.name)} disabled={saving}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}