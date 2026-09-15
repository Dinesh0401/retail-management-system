import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Product, Branch, Inventory as InventoryType } from '../types/api';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editReorder, setEditReorder] = useState<number>(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, b, i] = await Promise.all([api.getProducts(), api.getBranches(), api.getInventory()]);
      setProducts(p);
      setBranches(b);
      setInventory(i);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (inv: InventoryType) => {
    setEditingId(inv.id);
    setEditQuantity(inv.quantity);
    setEditReorder(inv.reorder_level);
  };

  const handleSave = async (id: string) => {
    try {
      await api.updateInventory(id, editQuantity, editReorder);
      setEditingId(null);
      await loadData();
    } catch (err: any) {
      alert('Failed to update: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading Inventory...</div>;
  if (error) return <div className="error">{error}</div>;

  const productMap = new Map(products.map(p => [p.id, p.name]));
  const branchMap = new Map(branches.map(b => [b.id, b.name]));

  const sortedInventory = [...inventory].sort((a, b) => {
    const pA = productMap.get(a.product_id) || '';
    const pB = productMap.get(b.product_id) || '';
    if (pA !== pB) return pA.localeCompare(pB);
    const bA = branchMap.get(a.branch_id) || '';
    const bB = branchMap.get(b.branch_id) || '';
    return bA.localeCompare(bB);
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Inventory Management</h1>
        <p>Assign stock levels and reorder thresholds across branches.</p>
      </header>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Branch</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedInventory.map(inv => (
            <tr key={inv.id}>
              <td>{productMap.get(inv.product_id) || 'Unknown Product'}</td>
              <td>{branchMap.get(inv.branch_id) || 'Unknown Branch'}</td>
              <td>
                {editingId === inv.id ? (
                  <input type="number" value={editQuantity} onChange={e => setEditQuantity(Number(e.target.value))} className="edit-input" />
                ) : (
                  <span className={inv.quantity === 0 ? 'text-muted' : ''}>{inv.quantity}</span>
                )}
              </td>
              <td>
                {editingId === inv.id ? (
                  <input type="number" value={editReorder} onChange={e => setEditReorder(Number(e.target.value))} className="edit-input" />
                ) : (
                  <span className={inv.reorder_level === 0 ? 'text-muted' : ''}>{inv.reorder_level}</span>
                )}
              </td>
              <td>
                {editingId === inv.id ? (
                  <div className="action-buttons">
                    <button onClick={() => handleSave(inv.id)} className="btn btn-primary btn-sm">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(inv)} className="btn btn-secondary btn-sm">Edit</button>
                )}
              </td>
            </tr>
          ))}
          {sortedInventory.length === 0 && (
            <tr><td colSpan={5} className="empty-state">No inventory records found. Create a product first.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
