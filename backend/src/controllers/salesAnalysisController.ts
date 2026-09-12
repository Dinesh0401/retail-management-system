import { Request, Response } from 'express';
import { getSalesAnalysis } from '../services/salesAnalysisService';

export const getSalesAnalysisHandler = async (req: Request, res: Response) => {
  try {
    const analysis = await getSalesAnalysis();
    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error generating sales analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate sales analysis',
    });
  }
};
