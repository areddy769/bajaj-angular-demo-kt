import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export function signToken(payload: JwtPayload): string {
  // jsonwebtoken types accept string | Buffer for secret; ours is always a string.
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
