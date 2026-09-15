import * as inventoryIntelligenceService from '../services/inventoryIntelligenceService';
import * as branchService from '../services/branchService';
import { getDecisionImpact } from '../services/decisionImpactService';
import { InventoryIntelligenceData } from '../types/inventoryIntelligence';
import { Branch } from '../types/branch';

jest.mock('../services/inventoryIntelligenceService');
jest.mock('../services/branchService');

const mockedIntelligenceService = inventoryIntelligenceService as jest.Mocked<typeof inventoryIntelligenceService>;
const mockedBranchService = branchService as jest.Mocked<typeof branchService>;

describe('Decision Impact Service', () => {
  const branches: Branch[] = [
    { id: 'b1', name: 'Chennai', location: 'Chennai', manager_name: null, created_at: '' },
    { id: 'b2', name: 'Salem', location: 'Salem', manager_name: null, created_at: '' },
    { id: 'b3', name: 'Coimbatore', location: 'Coimbatore', manager_name: null, created_at: '' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedBranchService.getBranches.mockResolvedValue(branches);
  });

  it('should recommend TRANSFER when a branch has surplus', async () => {
    const mockIntelligence: InventoryIntelligenceData = {
      total_inventory_items: 2,
      low_stock_items: 1,
      healthy_stock_items: 1,
      items: [
        { product_id: 'p1', branch_id: 'b1', quantity: 3, reorder_level: 5, stock_status: 'LOW_STOCK', reorder_recommended: true }, // Low stock, needs 5 - 3 + 1 = 3 to be healthy? No, needs 3 to reach 6.
        { product_id: 'p1', branch_id: 'b2', quantity: 42, reorder_level: 5, stock_status: 'HEALTHY', reorder_recommended: false }, // Surplus of 42 - 5 = 37
      ],
    };
    mockedIntelligenceService.getInventoryIntelligence.mockResolvedValue(mockIntelligence);

    const result = await getDecisionImpact();

    expect(result.decisions).toHaveLength(1);
    expect(result.decisions[0].decision_type).toBe('TRANSFER');
    expect(result.decisions[0].branch_id).toBe('b1');
    expect(result.decisions[0].description).toContain('Transfer');
    expect(result.decisions[0].description).toContain('Salem');
  });

  it('should recommend REORDER when no branch has enough surplus', async () => {
    const mockIntelligence: InventoryIntelligenceData = {
      total_inventory_items: 3,
      low_stock_items: 1,
      healthy_stock_items: 2,
      items: [
        { product_id: 'p1', branch_id: 'b1', quantity: 3, reorder_level: 5, stock_status: 'LOW_STOCK', reorder_recommended: true },
        { product_id: 'p1', branch_id: 'b2', quantity: 2, reorder_level: 5, stock_status: 'LOW_STOCK', reorder_recommended: true },
        { product_id: 'p1', branch_id: 'b3', quantity: 1, reorder_level: 5, stock_status: 'LOW_STOCK', reorder_recommended: true },
      ],
    };
    mockedIntelligenceService.getInventoryIntelligence.mockResolvedValue(mockIntelligence);

    const result = await getDecisionImpact();

    expect(result.decisions).toHaveLength(3);
    // All 3 should be REORDER because no branch has surplus
    result.decisions.forEach(d => {
      expect(d.decision_type).toBe('REORDER');
    });
  });

  it('should not recommend anything for HEALTHY or UNMONITORED items', async () => {
    const mockIntelligence: InventoryIntelligenceData = {
      total_inventory_items: 2,
      low_stock_items: 0,
      healthy_stock_items: 1,
      items: [
        { product_id: 'p1', branch_id: 'b1', quantity: 0, reorder_level: 0, stock_status: 'UNMONITORED', reorder_recommended: false },
        { product_id: 'p1', branch_id: 'b2', quantity: 42, reorder_level: 5, stock_status: 'HEALTHY', reorder_recommended: false },
      ],
    };
    mockedIntelligenceService.getInventoryIntelligence.mockResolvedValue(mockIntelligence);

    const result = await getDecisionImpact();

    expect(result.decisions).toHaveLength(0);
  });
});
