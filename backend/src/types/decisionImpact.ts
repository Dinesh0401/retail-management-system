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
