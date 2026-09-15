import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

// Reads `Authorization: Bearer <token>`, verifies it and attaches req.user.
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication token missing', statusCode: 401 });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication token missing', statusCode: 401 });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token', statusCode: 401 });
  }
}
