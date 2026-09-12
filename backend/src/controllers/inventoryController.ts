import { Request, Response } from 'express';
import { getInventory } from '../services/inventoryService';

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
