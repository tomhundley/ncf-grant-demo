/**
 * =============================================================================
 * Dashboard Resolvers
 * =============================================================================
 *
 * Provides aggregated statistics for the dashboard overview.
 * Demonstrates efficient use of Prisma aggregations and group by queries.
 */

import type { Context } from '../context.js';

export const dashboardResolvers = {
  Query: {
    /**
     * Returns aggregated statistics for the dashboard
     *
     * Efficiently fetches all statistics in parallel using Promise.all
     * to minimize database round trips.
     */
    dashboardStats: async (
      _parent: unknown,
      _args: unknown,
      { prisma }: Context
    ) => {
      // Execute all queries in parallel for efficiency
      const [
        totalMinistries,
        verifiedMinistries,
        totalDonors,
        totalFunds,
        balanceAggregate,
        disbursedAggregate,
        pendingAggregate,
        grantsByStatus,
      ] = await Promise.all([
        // Ministry counts
        prisma.ministry.count(),
        prisma.ministry.count({ where: { verified: true } }),

        // Donor and fund counts
        prisma.donor.count(),
        prisma.givingFund.count(),

        // Total balance across all funds
        prisma.givingFund.aggregate({
          _sum: { balance: true },
        }),

        // Total disbursed (funded grants)
        prisma.grant.aggregate({
          where: { status: 'FUNDED' },
          _sum: { amount: true },
        }),

        // Total pending amount
        prisma.grant.aggregate({
          where: { status: 'PENDING' },
          _sum: { amount: true },
        }),

        // Grant counts by status
        prisma.grant.groupBy({
          by: ['status'],
          _count: true,
        }),
      ]);

      // Transform grant status counts
      const statusCounts: Record<string, number> = {
        PENDING: 0,
        APPROVED: 0,
        FUNDED: 0,
        REJECTED: 0,
      };
      grantsByStatus.forEach((g) => {
        statusCounts[g.status] = g._count;
      });

      return {
        totalMinistries,
        verifiedMinistries,
        totalDonors,
        totalFunds,
        totalBalance: balanceAggregate._sum.balance ?? 0,
        totalDisbursed: disbursedAggregate._sum.amount ?? 0,
        pendingAmount: pendingAggregate._sum.amount ?? 0,
        grantsByStatus: {
          pending: statusCounts['PENDING'] ?? 0,
          approved: statusCounts['APPROVED'] ?? 0,
          funded: statusCounts['FUNDED'] ?? 0,
          rejected: statusCounts['REJECTED'] ?? 0,
          total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
        },
      };
    },
  },
};
