import { Request, Response } from 'express';
import { getBranches } from '../services/branchService';

export const getBranchesHandler = async (req: Request, res: Response) => {
  try {
    const branches = await getBranches();
    res.json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branches',
    });
  }
};
