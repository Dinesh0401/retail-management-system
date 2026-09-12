import { Request, Response } from 'express';
import { getDecisionImpact } from '../services/decisionImpactService';

export const getDecisionImpactHandler = async (req: Request, res: Response) => {
  try {
    const data = await getDecisionImpact();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error generating decisions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate decisions',
    });
  }
};
