import { getInventoryIntelligence } from './inventoryIntelligenceService';
import { DecisionImpactData, DecisionImpact } from '../types/decisionImpact';

export const getDecisionImpact = async (): Promise<DecisionImpactData> => {
  const intelligence = await getInventoryIntelligence();
  const decisions: DecisionImpact[] = [];

  for (const item of intelligence.items) {
    if (item.stock_status === 'LOW_STOCK') {
      const estimated_impact = item.quantity === 0 ? 'HIGH' : 'MEDIUM';

      decisions.push({
        branch_id: item.branch_id,
        product_id: item.product_id,
        decision_type: 'REORDER',
        description: `Stock is at or below reorder level (Quantity: ${item.quantity}, Reorder Level: ${item.reorder_level}).`,
        impact: estimated_impact,
      });
    }
  }

  return {
    total_decisions: decisions.length,
    decisions,
  };
};
