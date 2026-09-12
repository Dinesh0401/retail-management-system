// Represents a stock movement between branches or in/out of inventory
export interface StockMovement {
  readonly id: string;
  product_id: string;
  branch_id: string;
  movement_type: string;
  quantity: number;
  reason: string | null;
  readonly created_at: string;
}
