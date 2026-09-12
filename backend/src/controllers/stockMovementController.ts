import { Request, Response } from 'express';
import { getStockMovements } from '../services/stockMovementService';

export const getStockMovementsHandler = async (req: Request, res: Response) => {
  try {
    const stockMovements = await getStockMovements();
    res.json({
      success: true,
      data: stockMovements,
    });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock movements',
    });
  }
};
