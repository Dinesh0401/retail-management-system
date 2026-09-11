// Represents the current inventory level of a product at a branch
export interface Inventory {
  readonly id: string;
  productId: string;
  branchId: string;
  quantity: number;
  reorderLevel: number;
  lastUpdated: string;
}
