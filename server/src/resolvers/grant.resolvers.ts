/**
 * =============================================================================
 * Grant Resolvers
 * =============================================================================
 *
 * Handles all GraphQL operations related to Grant entities:
 *   - Query operations for fetching grants
 *   - Grant workflow mutations (create → approve → fund or reject)
 *   - Business logic for fund balance management
 *
 * Grant Workflow:
 *   1. createGrantRequest - Creates a PENDING grant
 *   2. approveGrant - Changes PENDING → APPROVED
 *   3. fundGrant - Changes APPROVED → FUNDED (deducts from fund balance)
 *   OR
 *   2. rejectGrant - Changes any status → REJECTED
 *
 * Key business rules:
 *   - Only verified ministries can receive grants
 *   - Fund balance is only affected when grant is FUNDED
 *   - Insufficient balance prevents funding
 */

import type { Grant, GivingFund, Ministry, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import type { Context } from '../context.js';

export const grantResolvers = {
  Query: {
    /**
     * Fetches a single grant by ID
     */
    grant: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<Grant | null> => {
      return prisma.grant.findUnique({
        where: { id },
      });
    },

    /**
     * Fetches grants with optional status and ministry filters
     */
    grants: async (
      _parent: unknown,
      {
        status,
        ministryId,
        givingFundId,
      }: {
        status?: string;
        ministryId?: number;
        givingFundId?: number;
      },
      { prisma }: Context
    ): Promise<Grant[]> => {
      const where: Prisma.GrantWhereInput = {};

      if (status) {
        where.status = status as Prisma.EnumGrantStatusFilter;
      }
      if (ministryId !== undefined) {
        where.ministryId = ministryId;
      }
      if (givingFundId !== undefined) {
        where.givingFundId = givingFundId;
      }

      return prisma.grant.findMany({
        where,
        orderBy: { requestedAt: 'desc' },
      });
    },
  },

  Mutation: {
    /**
     * Creates a new grant request in PENDING status
     *
     * Validates:
     *   - Ministry exists and is verified
     *   - Giving fund exists and is active
     *   - Amount is positive
     *
     * Note: Does NOT check or affect fund balance at this stage
     */
    createGrantRequest: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          amount: string | number;
          purpose?: string;
          givingFundId: number;
          ministryId: number;
        };
      },
      { prisma }: Context
    ): Promise<Grant> => {
      // Validate amount
      const grantAmount = new Decimal(input.amount);
      if (grantAmount.isNegative() || grantAmount.isZero()) {
        throw new Error('Grant amount must be positive');
      }

      // Verify ministry exists and is verified
      const ministry = await prisma.ministry.findUnique({
        where: { id: input.ministryId },
      });
      if (!ministry) {
        throw new Error(`Ministry with ID ${input.ministryId} not found`);
      }
      if (!ministry.verified) {
        throw new Error(
          'Cannot create grant for unverified ministry. Ministry must be verified first.'
        );
      }
      if (!ministry.active) {
        throw new Error('Cannot create grant for inactive ministry');
      }

      // Verify giving fund exists and is active
      const fund = await prisma.givingFund.findUnique({
        where: { id: input.givingFundId },
      });
      if (!fund) {
        throw new Error(`Giving fund with ID ${input.givingFundId} not found`);
      }
      if (!fund.active) {
        throw new Error('Cannot create grant from inactive giving fund');
      }

      // Create the grant request
      return prisma.grant.create({
        data: {
          amount: grantAmount,
          purpose: input.purpose?.trim(),
          status: 'PENDING',
          givingFundId: input.givingFundId,
          ministryId: input.ministryId,
        },
      });
    },

    /**
     * Approves a pending grant request
     * Changes status from PENDING → APPROVED
     *
     * Does NOT deduct from fund balance - that happens at funding stage
     */
    approveGrant: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<Grant | null> => {
      // Find the grant
      const grant = await prisma.grant.findUnique({
        where: { id },
      });
      if (!grant) {
        return null;
      }

      // Validate current status
      if (grant.status !== 'PENDING') {
        throw new Error(
          `Cannot approve grant in ${grant.status} status. Only PENDING grants can be approved.`
        );
      }

      // Update to APPROVED
      return prisma.grant.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });
    },

    /**
     * Rejects a grant request with optional reason
     * Can reject from any non-FUNDED status
     */
    rejectGrant: async (
      _parent: unknown,
      { id, reason }: { id: number; reason?: string },
      { prisma }: Context
    ): Promise<Grant | null> => {
      // Find the grant
      const grant = await prisma.grant.findUnique({
        where: { id },
      });
      if (!grant) {
        return null;
      }

      // Cannot reject an already funded grant
      if (grant.status === 'FUNDED') {
        throw new Error('Cannot reject a grant that has already been funded');
      }

      // Cannot reject an already rejected grant
      if (grant.status === 'REJECTED') {
        throw new Error('Grant is already rejected');
      }

      // Update to REJECTED
      return prisma.grant.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          notes: reason
            ? `${grant.notes ? grant.notes + '\n' : ''}Rejection reason: ${reason}`
            : grant.notes,
        },
      });
    },

    /**
     * Funds an approved grant (disburses to ministry)
     *
     * This is the key business logic mutation that:
     *   1. Validates the grant is in APPROVED status
     *   2. Checks sufficient fund balance
     *   3. Deducts from giving fund balance
     *   4. Updates grant status to FUNDED
     *
     * Uses a transaction to ensure atomicity
     */
    fundGrant: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<Grant | null> => {
      // Use transaction for atomicity
      return prisma.$transaction(async (tx) => {
        // Find the grant with fund
        const grant = await tx.grant.findUnique({
          where: { id },
          include: { givingFund: true },
        });
        if (!grant) {
          return null;
        }

        // Validate status
        if (grant.status !== 'APPROVED') {
          throw new Error(
            `Cannot fund grant in ${grant.status} status. Grant must be APPROVED first.`
          );
        }

        // Check sufficient balance
        const fundBalance = new Decimal(grant.givingFund.balance);
        const grantAmount = new Decimal(grant.amount);

        if (fundBalance.lessThan(grantAmount)) {
          throw new Error(
            `Insufficient fund balance. Available: $${fundBalance.toFixed(2)}, Required: $${grantAmount.toFixed(2)}`
          );
        }

        // Deduct from fund balance
        await tx.givingFund.update({
          where: { id: grant.givingFundId },
          data: {
            balance: {
              decrement: grantAmount,
            },
          },
        });

        // Update grant status to FUNDED
        return tx.grant.update({
          where: { id },
          data: {
            status: 'FUNDED',
            fundedAt: new Date(),
          },
        });
      });
    },
  },

  /**
   * Field resolvers for computed fields on Grant type
   */
  Grant: {
    /**
     * Resolves the giving fund for this grant
     */
    givingFund: async (
      parent: Grant,
      _args: unknown,
      { prisma }: Context
    ): Promise<GivingFund | null> => {
      return prisma.givingFund.findUnique({
        where: { id: parent.givingFundId },
      });
    },

    /**
     * Resolves the ministry receiving this grant
     */
    ministry: async (
      parent: Grant,
      _args: unknown,
      { prisma }: Context
    ): Promise<Ministry | null> => {
      return prisma.ministry.findUnique({
        where: { id: parent.ministryId },
      });
    },
  },
};
