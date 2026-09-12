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
