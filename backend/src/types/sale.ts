// Represents a sale transaction of a product at a branch
export interface Sale {
  readonly id: string;
  productId: string;
  branchId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string;
}
