// Attaches the authenticated user to Express Request so controllers
// can read `req.user` with full TypeScript type-safety.
//
// NOTE: this is a real `.ts` module (not `.d.ts`) and is imported once in
// `app.ts`, because ts-node compiles files on demand and would otherwise
// never load a standalone declaration file at runtime.

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
