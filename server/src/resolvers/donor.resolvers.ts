/**
 * =============================================================================
 * Donor Resolvers
 * =============================================================================
 *
 * Handles all GraphQL operations related to Donor entities:
 *   - Query operations for fetching donors
 *   - Mutation for creating new donors
 *   - Computed fields for giving funds and total balance
 *
 * Donors are individuals or families who establish giving funds for
 * charitable distributions to ministries.
 */

import type { Donor, Prisma } from '@prisma/client';
import type { Context } from '../context.js';

export const donorResolvers = {
  Query: {
    /**
     * Fetches a single donor by ID
     */
    donor: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<Donor | null> => {
      return prisma.donor.findUnique({
        where: { id },
      });
    },

    /**
     * Fetches all donors
     * In a production app, this would include pagination
     */
    donors: async (
      _parent: unknown,
      _args: unknown,
      { prisma }: Context
    ): Promise<Donor[]> => {
      return prisma.donor.findMany({
        orderBy: { lastName: 'asc' },
      });
    },
  },

  Mutation: {
    /**
     * Creates a new donor record
     * Email must be unique
     */
    createDonor: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          firstName: string;
          lastName: string;
          email: string;
          phone?: string;
        };
      },
      { prisma }: Context
    ): Promise<Donor> => {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        throw new Error('Invalid email format');
      }

      // Check for existing donor with same email
      const existing = await prisma.donor.findUnique({
        where: { email: input.email.toLowerCase() },
      });
      if (existing) {
        throw new Error('A donor with this email already exists');
      }

      return prisma.donor.create({
        data: {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.toLowerCase().trim(),
          phone: input.phone?.trim(),
        },
      });
    },
  },

  /**
   * Field resolvers for computed fields on Donor type
   */
  Donor: {
    /**
     * Computes the full name from first and last name
     */
    fullName: (parent: Donor): string => {
      return `${parent.firstName} ${parent.lastName}`;
    },

    /**
     * Resolves all giving funds owned by this donor
     */
    givingFunds: async (
      parent: Donor,
      _args: unknown,
      { prisma }: Context
    ) => {
      return prisma.givingFund.findMany({
        where: { donorId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },

    /**
     * Calculates total balance across all giving funds
     */
    totalBalance: async (
      parent: Donor,
      _args: unknown,
      { prisma }: Context
    ) => {
      const result = await prisma.givingFund.aggregate({
        where: { donorId: parent.id },
        _sum: { balance: true },
      });
      return result._sum.balance ?? 0;
    },
  },
};
