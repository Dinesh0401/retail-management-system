import { getInventoryIntelligence } from './inventoryIntelligenceService';
import { getBranches } from './branchService';
import { DecisionImpactData, DecisionImpact } from '../types/decisionImpact';

export const getDecisionImpact = async (): Promise<DecisionImpactData> => {
  const intelligence = await getInventoryIntelligence();
  const branches = await getBranches();
  const branchMap = new Map(branches.map(b => [b.id, b.name]));
  
  const decisions: DecisionImpact[] = [];

  for (const item of intelligence.items) {
    if (item.stock_status === 'LOW_STOCK') {
      const estimated_impact = item.quantity === 0 ? 'HIGH' : 'MEDIUM';
      
      // Calculate how much we need to get back to a healthy state
      const neededAmount = item.reorder_level - item.quantity + 1;

      // Look for a branch with enough surplus to cover the needed amount
      const surplusBranch = intelligence.items.find(other => 
        other.product_id === item.product_id && 
        other.branch_id !== item.branch_id && 
        (other.quantity - other.reorder_level) >= neededAmount
      );

      if (surplusBranch) {
        const sourceBranchName = branchMap.get(surplusBranch.branch_id) || surplusBranch.branch_id;
        decisions.push({
          branch_id: item.branch_id,
          product_id: item.product_id,
          decision_type: 'TRANSFER',
          description: `Transfer ${neededAmount} units from ${sourceBranchName} to restore healthy stock levels.`,
          impact: estimated_impact,
        });
      } else {
        decisions.push({
          branch_id: item.branch_id,
          product_id: item.product_id,
          decision_type: 'REORDER',
          description: `Stock is at or below reorder level (Quantity: ${item.quantity}, Reorder Level: ${item.reorder_level}).`,
          impact: estimated_impact,
        });
      }
    }
  }

  return {
    total_decisions: decisions.length,
    decisions,
  };
};
