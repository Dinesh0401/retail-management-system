export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  unit_price: number;
  cost_price: number;
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager_name: string | null;
  created_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  branch_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  sold_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  branch_id: string;
  quantity: number;
  reorder_level: number;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  branch_id: string;
  movement_type: string;
  quantity: number;
  reason: string | null;
  created_at: string;
}

export interface ProductSalesAggregate {
  product_id: string;
  total_quantity: number;
  total_amount: number;
  transaction_count: number;
}

export interface BranchSalesAggregate {
  branch_id: string;
  total_quantity: number;
  total_amount: number;
  transaction_count: number;
}

export interface SalesAnalysisData {
  total_sales_amount: number;
  total_units_sold: number;
  total_transactions: number;
  sales_by_product: ProductSalesAggregate[];
  sales_by_branch: BranchSalesAggregate[];
  top_selling_products: ProductSalesAggregate[];
}

export interface InventoryIntelligenceItem {
  product_id: string;
  branch_id: string;
  quantity: number;
  reorder_level: number;
  stock_status: 'LOW_STOCK' | 'HEALTHY';
  reorder_recommended: boolean;
}

export interface InventoryIntelligenceData {
  total_inventory_items: number;
  low_stock_items: number;
  healthy_stock_items: number;
  items: InventoryIntelligenceItem[];
}

export interface DecisionImpact {
  branch_id: string;
  product_id: string;
  decision_type: string;
  description: string;
  impact: string;
}

export interface DecisionImpactData {
  total_decisions: number;
  decisions: DecisionImpact[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
