import { NextFunction, Request, Response } from 'express';
import { loginSchema } from '../validators/auth.validator';
import * as authService from '../services/auth.service';
import { ok } from '../utils/api-response';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.status(200).json(ok('Login successful', result));
  } catch (err) {
    next(err);
  }
}
