/**
 * =============================================================================
 * Giving Fund Resolvers
 * =============================================================================
 *
 * Handles all GraphQL operations related to GivingFund entities:
 *   - Query operations for fetching funds
 *   - Mutations for creating funds and adding contributions
 *   - Computed fields for grants and statistics
 *
 * A GivingFund is a donor-advised fund that holds charitable assets.
 * Donors can recommend grants from their fund to verified ministries.
 */

import type { GivingFund, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import type { Context } from '../context.js';

export const givingFundResolvers = {
  Query: {
    /**
     * Fetches a single giving fund by ID
     */
    givingFund: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<GivingFund | null> => {
      return prisma.givingFund.findUnique({
        where: { id },
      });
    },

    /**
     * Fetches all giving funds, optionally filtered by donor
     */
    givingFunds: async (
      _parent: unknown,
      { donorId }: { donorId?: number },
      { prisma }: Context
    ): Promise<GivingFund[]> => {
      const where: Prisma.GivingFundWhereInput = {};
      if (donorId !== undefined) {
        where.donorId = donorId;
      }

      return prisma.givingFund.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    /**
     * Creates a new giving fund for a donor
     */
    createGivingFund: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          name: string;
          description?: string;
          initialBalance?: string | number;
          donorId: number;
        };
      },
      { prisma }: Context
    ): Promise<GivingFund> => {
      // Verify donor exists
      const donor = await prisma.donor.findUnique({
        where: { id: input.donorId },
      });
      if (!donor) {
        throw new Error(`Donor with ID ${input.donorId} not found`);
      }

      // Parse and validate initial balance
      let balance = new Decimal(0);
      if (input.initialBalance !== undefined) {
        balance = new Decimal(input.initialBalance);
        if (balance.isNegative()) {
          throw new Error('Initial balance cannot be negative');
        }
      }

      return prisma.givingFund.create({
        data: {
          name: input.name.trim(),
          description: input.description?.trim(),
          balance,
          donorId: input.donorId,
          active: true,
        },
      });
    },

    /**
     * Adds funds (contribution) to a giving fund
     * Returns the updated fund with new balance
     */
    addFunds: async (
      _parent: unknown,
      { fundId, amount }: { fundId: number; amount: string | number },
      { prisma }: Context
    ): Promise<GivingFund | null> => {
      // Validate amount
      const contribution = new Decimal(amount);
      if (contribution.isNegative() || contribution.isZero()) {
        throw new Error('Contribution amount must be positive');
      }

      // Find the fund
      const fund = await prisma.givingFund.findUnique({
        where: { id: fundId },
      });
      if (!fund) {
        return null;
      }

      if (!fund.active) {
        throw new Error('Cannot add funds to an inactive giving fund');
      }

      // Update balance
      return prisma.givingFund.update({
        where: { id: fundId },
        data: {
          balance: {
            increment: contribution,
          },
        },
      });
    },
  },

  /**
   * Field resolvers for computed fields on GivingFund type
   */
  GivingFund: {
    /**
     * Resolves the donor who owns this fund
     */
    donor: async (
      parent: GivingFund,
      _args: unknown,
      { prisma }: Context
    ) => {
      return prisma.donor.findUnique({
        where: { id: parent.donorId },
      });
    },

    /**
     * Resolves all grants made from this fund
     */
    grants: async (
      parent: GivingFund,
      _args: unknown,
      { prisma }: Context
    ) => {
      return prisma.grant.findMany({
        where: { givingFundId: parent.id },
        orderBy: { requestedAt: 'desc' },
      });
    },

    /**
     * Calculates total amount disbursed (funded grants) from this fund
     */
    totalDisbursed: async (
      parent: GivingFund,
      _args: unknown,
      { prisma }: Context
    ) => {
      const result = await prisma.grant.aggregate({
        where: {
          givingFundId: parent.id,
          status: 'FUNDED',
        },
        _sum: { amount: true },
      });
      return result._sum.amount ?? 0;
    },

    /**
     * Returns grant counts by status for this fund
     */
    grantCounts: async (
      parent: GivingFund,
      _args: unknown,
      { prisma }: Context
    ) => {
      const counts = await prisma.grant.groupBy({
        by: ['status'],
        where: { givingFundId: parent.id },
        _count: true,
      });

      const countMap: Record<string, number> = {
        PENDING: 0,
        APPROVED: 0,
        FUNDED: 0,
        REJECTED: 0,
      };

      counts.forEach((c) => {
        countMap[c.status] = c._count;
      });

      return {
        pending: countMap['PENDING'] ?? 0,
        approved: countMap['APPROVED'] ?? 0,
        funded: countMap['FUNDED'] ?? 0,
        rejected: countMap['REJECTED'] ?? 0,
        total: Object.values(countMap).reduce((a, b) => a + b, 0),
      };
    },
  },
};
