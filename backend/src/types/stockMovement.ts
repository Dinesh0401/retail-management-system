// Direction of stock movement
export type MovementType = 'in' | 'out' | 'transfer';

// Current status of a stock movement
export type MovementStatus = 'pending' | 'completed' | 'cancelled';

// Represents a stock movement between branches or in/out of inventory
export interface StockMovement {
  readonly id: string;
  productId: string;
  fromBranchId: string | null;
  toBranchId: string | null;
  quantity: number;
  type: MovementType;
  status: MovementStatus;
  movementDate: string;
  notes?: string;
}
