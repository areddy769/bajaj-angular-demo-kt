import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/api-response';
import { isDev } from '../config/env';

// Central error translator — controllers throw AppError / ZodError / Prisma errors,
// this middleware converts them into consistent JSON responses.
export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((i) => ({
      field: i.path.join('.') || 'body',
      message: i.message,
    }));
    res.status(400).json({ success: false, message: 'Validation failed', statusCode: 400, errors });
    return;
  }

  // Our own intentional errors
  if (err instanceof AppError) {
    const body: Record<string, unknown> = {
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    };
    if (err.errors) body['errors'] = err.errors;
    res.status(err.statusCode).json(body);
    return;
  }

  // Prisma known errors (P2002 = unique conflict, P2025 = not found, P2003 etc.)
  const maybePrisma = err as { code?: string; message?: string };
  if (maybePrisma && typeof maybePrisma.code === 'string' && maybePrisma.code.startsWith('P')) {
    if (maybePrisma.code === 'P2002') {
      res.status(409).json({ success: false, message: 'Record already exists (duplicate value)', statusCode: 409 });
      return;
    }
    if (maybePrisma.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Record not found', statusCode: 404 });
      return;
    }
    res.status(400).json({ success: false, message: 'Database request failed', statusCode: 400 });
    return;
  }

  // Unexpected — log in dev, hide internals from client
  if (isDev) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }
  res.status(500).json({ success: false, message: 'Internal server error', statusCode: 500 });
}
