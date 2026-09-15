import type { FormEvent } from 'react';

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  unit_price: string;
  cost_price: string;
}

interface ProductFormProps {
  form: ProductFormData;
  isEditing: boolean;
  saving: boolean;
  onChange: (field: keyof ProductFormData, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export default function ProductForm({
  form,
  isEditing,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  return (
    <form className="card" onSubmit={onSubmit}>
      <h3>{isEditing ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
      <div className="form-grid">
        <input
          placeholder="Product Name *"
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          disabled={saving}
          required
        />
        <input
          placeholder="SKU *"
          value={form.sku}
          onChange={(e) => onChange('sku', e.target.value)}
          disabled={saving}
          required
        />
        <select
          value={form.category}
          onChange={(e) => onChange('category', e.target.value)}
          disabled={saving}
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
          min="0"
          placeholder="Unit Price (₹) *"
          value={form.unit_price}
          onChange={(e) => onChange('unit_price', e.target.value)}
          disabled={saving}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Cost Price (₹) *"
          value={form.cost_price}
          onChange={(e) => onChange('cost_price', e.target.value)}
          disabled={saving}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEditing ? '💾 Update Product' : '➕ Add Product'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
