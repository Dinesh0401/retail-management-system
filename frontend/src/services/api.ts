import type {
  Product,
  Branch,
  Sale,
  Inventory,
  StockMovement,
  SalesAnalysisData,
  InventoryIntelligenceData,
  DecisionImpactData,
  ApiResponse
} from '../types/api';

const API_BASE = 'http://localhost:5000/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  const json: ApiResponse<T> = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'API request failed');
  }
  return json.data;
}

export const api = {
  getProducts: () => fetchApi<Product[]>('/products'),
  createProduct: (data: Partial<Product>) => fetchApi<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProduct: (id: string, data: Partial<Product>) => fetchApi<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteProduct: (id: string) => fetchApi<void>(`/products/${id}`, {
    method: 'DELETE',
  }),

  getBranches: () => fetchApi<Branch[]>('/branches'),
  getSales: () => fetchApi<Sale[]>('/sales'),
  getInventory: () => fetchApi<Inventory[]>('/inventory'),
  getStockMovements: () => fetchApi<StockMovement[]>('/stock-movements'),
  getSalesAnalysis: () => fetchApi<SalesAnalysisData>('/sales-analysis'),
  getInventoryIntelligence: () => fetchApi<InventoryIntelligenceData>('/inventory-intelligence'),
  getDecisionImpact: () => fetchApi<DecisionImpactData>('/decision-impact'),
};
