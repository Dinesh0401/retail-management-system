// Type of business decision/recommendation
export type DecisionType = 'restock' | 'transfer' | 'discontinue' | 'pricing';

// Urgency level of a decision
export type DecisionPriority = 'low' | 'medium' | 'high';

// Lifecycle status of a decision
export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'implemented';

// Represents a simple business decision or recommendation
export interface Decision {
  readonly id: string;
  type: DecisionType;
  title: string;
  description: string;
  priority: DecisionPriority;
  status: DecisionStatus;
  relatedProductId?: string;
  relatedBranchId?: string;
  readonly createdAt: string;
}
