// Represents the current inventory level of a product at a branch
export interface Inventory {
  readonly id: string;
  product_id: string;
  branch_id: string;
  quantity: number;
  reorder_level: number;
  readonly updated_at: string;
}
