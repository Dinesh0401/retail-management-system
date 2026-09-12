// Represents a sale transaction of a product at a branch
export interface Sale {
  readonly id: string;
  product_id: string;
  branch_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  readonly sold_at: string;
}
