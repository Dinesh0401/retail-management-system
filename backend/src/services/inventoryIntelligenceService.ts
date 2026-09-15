import { getInventory } from './inventoryService';
import { InventoryIntelligenceData, InventoryIntelligenceItem } from '../types/inventoryIntelligence';

export const getInventoryIntelligence = async (): Promise<InventoryIntelligenceData> => {
  const inventory = await getInventory();

  let low_stock_items = 0;
  let healthy_stock_items = 0;
  const items: InventoryIntelligenceItem[] = [];

  for (const record of inventory) {
    const qty = Number(record.quantity) || 0;
    const reorder = Number(record.reorder_level) || 0;

    let stock_status: 'LOW_STOCK' | 'HEALTHY' | 'UNMONITORED';
    let reorder_recommended = false;

    if (qty === 0 && reorder === 0) {
      stock_status = 'UNMONITORED';
    } else {
      const isLowStock = qty <= reorder;
      stock_status = isLowStock ? 'LOW_STOCK' : 'HEALTHY';
      reorder_recommended = isLowStock;

      if (isLowStock) {
        low_stock_items++;
      } else {
        healthy_stock_items++;
      }
    }

    items.push({
      product_id: record.product_id,
      branch_id: record.branch_id,
      quantity: qty,
      reorder_level: reorder,
      stock_status,
      reorder_recommended,
    });
  }

  return {
    total_inventory_items: items.length,
    low_stock_items,
    healthy_stock_items,
    items,
  };
};
