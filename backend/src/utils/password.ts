import bcrypt from 'bcryptjs';

// bcryptjs is a pure-JS implementation of bcrypt (same hashes as the
// native `bcrypt` package) but needs no compiler — ideal for freshers on Windows.
const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
