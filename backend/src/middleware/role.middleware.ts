import { NextFunction, Request, Response } from 'express';

type Role = 'ADMIN' | 'USER';

// Backend authorization — never rely only on Angular route guards.
export function authorizeRoles(...allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated', statusCode: 401 });
      return;
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions', statusCode: 403 });
      return;
    }
    next();
  };
}
