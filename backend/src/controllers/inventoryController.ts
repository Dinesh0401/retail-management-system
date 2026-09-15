import { Request, Response } from 'express';
import { getInventory, updateInventory } from '../services/inventoryService';

export const getInventoryHandler = async (req: Request, res: Response) => {
  try {
    const inventory = await getInventory();
    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
    });
  }
};

export const updateInventoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, reorder_level } = req.body;
    
    if (quantity === undefined || reorder_level === undefined) {
      return res.status(400).json({
        success: false,
        message: 'quantity and reorder_level are required',
      });
    }

    const inventory = await updateInventory(id, Number(quantity), Number(reorder_level));
    res.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory',
    });
  }
};
