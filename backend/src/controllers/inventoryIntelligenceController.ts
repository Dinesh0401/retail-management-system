import { Request, Response } from 'express';
import { getInventoryIntelligence } from '../services/inventoryIntelligenceService';

export const getInventoryIntelligenceHandler = async (req: Request, res: Response) => {
  try {
    const intelligence = await getInventoryIntelligence();
    res.json({
      success: true,
      data: intelligence,
    });
  } catch (error) {
    console.error('Error generating inventory intelligence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate inventory intelligence',
    });
  }
};
