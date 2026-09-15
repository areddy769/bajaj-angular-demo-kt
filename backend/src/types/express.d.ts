// Attaches the authenticated user to Express Request so controllers
// can read `req.user` with full TypeScript type-safety.

declare global {
  namespace Express {
    interface AuthUser {
      userId: number;
      email: string;
      role: 'ADMIN' | 'USER';
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
