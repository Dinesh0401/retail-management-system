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
      
      // Calculate how much we need to reach the reorder level safely
      // Adding 1 so it actually goes ABOVE the reorder level
      const required = item.reorder_level - item.quantity + 1;

      // Look for a branch with ANY surplus
      const surplusBranch = intelligence.items.find(other => 
        other.product_id === item.product_id && 
        other.branch_id !== item.branch_id && 
        (other.quantity - other.reorder_level) > 0
      );

      if (surplusBranch) {
        const surplus = surplusBranch.quantity - surplusBranch.reorder_level;
        const transferQuantity = Math.min(surplus, required);
        
        const sourceBranchName = branchMap.get(surplusBranch.branch_id) || surplusBranch.branch_id;
        decisions.push({
          branch_id: item.branch_id,
          product_id: item.product_id,
          decision_type: 'TRANSFER',
          description: `Transfer ${transferQuantity} units from ${sourceBranchName} to restore healthy stock levels.`,
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
