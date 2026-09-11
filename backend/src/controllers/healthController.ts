import { Request, Response } from 'express';
import { getHealthStatus } from '../services/healthService';

// Handles GET /api/health
export function healthCheck(req: Request, res: Response): void {
  const health = getHealthStatus();
  res.status(200).json(health);
}
