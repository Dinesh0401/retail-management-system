import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { api } from '../services/api';
import type {
  Product,
  Branch,
  SalesAnalysisData,
  InventoryIntelligenceData,
  DecisionImpactData
} from '../types/api';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [salesData, setSalesData] = useState<SalesAnalysisData | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryIntelligenceData | null>(null);
  const [decisionData, setDecisionData] = useState<DecisionImpactData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [
          fetchedProducts,
          fetchedBranches,
          fetchedSales,
          fetchedInventory,
          fetchedDecisions
        ] = await Promise.all([
          api.getProducts(),
          api.getBranches(),
          api.getSalesAnalysis(),
          api.getInventoryIntelligence(),
          api.getDecisionImpact(),
        ]);

        setProducts(fetchedProducts);
        setBranches(fetchedBranches);
        setSalesData(fetchedSales);
        setInventoryData(fetchedInventory);
        setDecisionData(fetchedDecisions);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!salesData || !inventoryData || !decisionData) return <div>No data available</div>;

  // Helper maps for names
  const productMap = new Map(products.map(p => [p.id, p.name]));
  const branchMap = new Map(branches.map(b => [b.id, b.name]));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Retail Intelligence Dashboard</h1>
        <p>Real-time insights and automated decisions</p>
      </header>

      {/* KPI Cards */}
      <section className="kpi-grid">
        <div className="card kpi-card">
          <h3>Total Sales</h3>
          <p className="kpi-value">{formatCurrency(salesData.total_sales_amount)}</p>
        </div>
        <div className="card kpi-card">
          <h3>Units Sold</h3>
          <p className="kpi-value">{salesData.total_units_sold}</p>
        </div>
        <div className="card kpi-card">
          <h3>Transactions</h3>
          <p className="kpi-value">{salesData.total_transactions}</p>
        </div>
        <div className="card kpi-card alert-kpi">
          <h3>Low Stock Items</h3>
          <p className="kpi-value">{inventoryData.low_stock_items}</p>
        </div>
      </section>

      <div className="dashboard-content">
        {/* Sales Section */}
        <div className="dashboard-column">
          <section className="card">
            <h2>Top Selling Products</h2>
            <div style={{ width: '100%', height: 250, marginBottom: '20px' }}>
              <ResponsiveContainer>
                <BarChart data={salesData.top_selling_products.map(p => ({
                    name: productMap.get(p.product_id) || 'Unknown',
                    revenue: p.total_amount
                  }))} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value: number) => `₹${value}`} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesData.top_selling_products.map(p => (
                  <tr key={p.product_id}>
                    <td>{productMap.get(p.product_id) || 'Unknown'}</td>
                    <td>{p.total_quantity}</td>
                    <td>{formatCurrency(p.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <h2>Sales by Branch</h2>
            <div style={{ width: '100%', height: 250, marginBottom: '20px' }}>
              <ResponsiveContainer>
                <BarChart data={salesData.sales_by_branch.map(b => ({
                    name: branchMap.get(b.branch_id) || 'Unknown',
                    revenue: b.total_amount
                  }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value: number) => `₹${value}`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Txns</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesData.sales_by_branch.map(b => (
                  <tr key={b.branch_id}>
                    <td>{branchMap.get(b.branch_id) || 'Unknown'}</td>
                    <td>{b.transaction_count}</td>
                    <td>{formatCurrency(b.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Inventory & Decisions Section */}
        <div className="dashboard-column">
          <section className="card">
            <h2>Inventory Intelligence</h2>
            <div style={{ width: '100%', height: 200, marginBottom: '10px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Healthy', value: inventoryData.healthy_stock_items, color: '#137333' },
                      { name: 'Low Stock', value: inventoryData.low_stock_items, color: '#c5221f' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Healthy', value: inventoryData.healthy_stock_items, color: '#137333' },
                      { name: 'Low Stock', value: inventoryData.low_stock_items, color: '#c5221f' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="inventory-summary">
              <div className="summary-item healthy">
                <strong>Healthy:</strong> {inventoryData.healthy_stock_items}
              </div>
              <div className="summary-item low-stock">
                <strong>Low Stock:</strong> {inventoryData.low_stock_items}
              </div>
            </div>
            
            <h3>Low Stock Alerts</h3>
            <ul className="alert-list">
              {inventoryData.items.filter(i => i.stock_status === 'LOW_STOCK').map((item, idx) => (
                <li key={idx} className="alert-item">
                  <strong>{productMap.get(item.product_id)}</strong> at {branchMap.get(item.branch_id)} 
                  <span className="qty-badge">Qty: {item.quantity} (Reorder: {item.reorder_level})</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Automated Decisions</h2>
            <p>Recommended actions based on current inventory thresholds.</p>
            <div className="decision-list">
              {decisionData.decisions.length === 0 ? (
                <p>No actions required at this time.</p>
              ) : (
                decisionData.decisions.map((decision, idx) => (
                  <div key={idx} className={`decision-card impact-${decision.impact.toLowerCase()}`}>
                    <div className="decision-header">
                      <span className="decision-type">{decision.decision_type}</span>
                      <span className="decision-impact">{decision.impact} IMPACT</span>
                    </div>
                    <h4>{productMap.get(decision.product_id)} @ {branchMap.get(decision.branch_id)}</h4>
                    <p>{decision.description}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;