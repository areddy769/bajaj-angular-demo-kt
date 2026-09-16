import { prisma } from '../config/prisma';
import { comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/api-response';
import { LoginInput } from '../validators/auth.validator';

// Never return passwordHash — pick only safe fields.
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
} as const;

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await comparePassword(input.password, user.passwordHash);
  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== 'ACTIVE') {
    throw new AppError('User account is inactive', 403);
  }

  // Role is stored as a String on SQLite (see schema note) — it is only
  // ever written through Zod-validated inputs, so this cast is safe.
  const role = user.role as 'ADMIN' | 'USER';
  const token = signToken({ userId: user.id, email: user.email, role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
}

export { safeUserSelect };
