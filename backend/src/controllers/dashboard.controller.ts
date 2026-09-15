import { NextFunction, Request, Response } from 'express';
import { getDashboardSummary } from '../services/dashboard.service';
import { ok } from '../utils/api-response';

export async function summary(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getDashboardSummary();
    res.status(200).json(ok('Dashboard summary fetched', data));
  } catch (err) {
    next(err);
  }
}
