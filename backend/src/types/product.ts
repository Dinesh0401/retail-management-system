// Product category options for retail items
export type ProductCategory =
  | 'electronics'
  | 'clothing'
  | 'grocery'
  | 'household'
  | 'other';

// Represents a retail product in the system
export interface Product {
  readonly id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  unit_price: number;
  cost_price: number;
  readonly created_at: string;
}
