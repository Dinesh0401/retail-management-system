import { Request, Response } from 'express';
import { getSales } from '../services/saleService';

export const getSalesHandler = async (req: Request, res: Response) => {
  try {
    const sales = await getSales();
    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales',
    });
  }
};
