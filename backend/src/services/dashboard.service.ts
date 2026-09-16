import { prisma } from '../config/prisma';

// Counts are always computed from the live database — never hard-coded.
export async function getDashboardSummary() {
  const [totalCustomers, activeCustomers, totalUsers] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count(),
  ]);

  return {
    totalCustomers,
    activeCustomers,
    inactiveCustomers: totalCustomers - activeCustomers,
    totalUsers,
  };
}
