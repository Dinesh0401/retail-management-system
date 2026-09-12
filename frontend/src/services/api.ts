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

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  const json: ApiResponse<T> = await response.json();
  if (!json.success) {
    throw new Error(json.message || 'API request failed');
  }
  return json.data;
}

export const api = {
  getProducts: () => fetchApi<Product[]>('/products'),
  getBranches: () => fetchApi<Branch[]>('/branches'),
  getSales: () => fetchApi<Sale[]>('/sales'),
  getInventory: () => fetchApi<Inventory[]>('/inventory'),
  getStockMovements: () => fetchApi<StockMovement[]>('/stock-movements'),
  getSalesAnalysis: () => fetchApi<SalesAnalysisData>('/sales-analysis'),
  getInventoryIntelligence: () => fetchApi<InventoryIntelligenceData>('/inventory-intelligence'),
  getDecisionImpact: () => fetchApi<DecisionImpactData>('/decision-impact'),
};
