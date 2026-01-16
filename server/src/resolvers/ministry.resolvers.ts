/**
 * =============================================================================
 * Ministry Resolvers
 * =============================================================================
 *
 * Handles all GraphQL operations related to Ministry entities:
 *   - CRUD operations (Create, Read, Update, Delete)
 *   - Pagination with cursor-based navigation
 *   - Filtering by category, verification status, and search terms
 *   - Computed fields for grant statistics
 *
 * Best practices demonstrated:
 *   - Type-safe context with Prisma client
 *   - Proper error handling with meaningful messages
 *   - Efficient database queries with select/include optimization
 *   - Base64 cursor encoding for pagination
 */

import type { Ministry, GrantStatus, Prisma } from '@prisma/client';
import type { Context } from '../context.js';

/**
 * Encodes a ministry ID as a cursor for pagination
 */
function encodeCursor(id: number): string {
  return Buffer.from(`ministry:${id}`).toString('base64');
}

/**
 * Decodes a cursor back to a ministry ID
 */
function decodeCursor(cursor: string): number {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  const id = parseInt(decoded.replace('ministry:', ''), 10);
  if (isNaN(id)) {
    throw new Error('Invalid cursor format');
  }
  return id;
}

interface MinistryFilter {
  category?: string;
  verified?: boolean;
  active?: boolean;
  search?: string;
  state?: string;
}

export const ministryResolvers = {
  Query: {
    /**
     * Fetches a single ministry by ID
     */
    ministry: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<Ministry | null> => {
      return prisma.ministry.findUnique({
        where: { id },
      });
    },

    /**
     * Fetches paginated ministries with optional filtering
     * Implements Relay-style cursor pagination
     */
    ministries: async (
      _parent: unknown,
      {
        filter,
        first = 20,
        after,
      }: {
        filter?: MinistryFilter;
        first?: number;
        after?: string;
      },
      { prisma }: Context
    ) => {
      // Validate pagination parameters
      const take = Math.min(Math.max(first, 1), 100); // Between 1 and 100

      // Build where clause from filter
      const where: Prisma.MinistryWhereInput = {};

      if (filter) {
        if (filter.category) {
          where.category = filter.category as Prisma.EnumMinistryCategoryFilter;
        }
        if (filter.verified !== undefined) {
          where.verified = filter.verified;
        }
        if (filter.active !== undefined) {
          where.active = filter.active;
        }
        if (filter.state) {
          where.state = filter.state;
        }
        if (filter.search) {
          where.name = {
            contains: filter.search,
            mode: 'insensitive',
          };
        }
      }

      // Handle cursor-based pagination
      let cursor: { id: number } | undefined;
      if (after) {
        cursor = { id: decodeCursor(after) };
      }

      // Fetch total count for pagination info
      const totalCount = await prisma.ministry.count({ where });

      // Fetch items with one extra to determine if there's a next page
      const items = await prisma.ministry.findMany({
        where,
        take: take + 1, // Fetch one extra to check for next page
        skip: cursor ? 1 : 0, // Skip the cursor item itself
        cursor,
        orderBy: { id: 'asc' },
      });

      // Determine if there are more pages
      const hasNextPage = items.length > take;
      const edges = items.slice(0, take).map((ministry) => ({
        node: ministry,
        cursor: encodeCursor(ministry.id),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: edges[0]?.cursor ?? null,
          endCursor: edges[edges.length - 1]?.cursor ?? null,
          totalCount,
        },
      };
    },
  },

  Mutation: {
    /**
     * Creates a new ministry record
     * New ministries are unverified by default
     */
    createMinistry: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          name: string;
          ein?: string;
          category: string;
          description?: string;
          mission?: string;
          website?: string;
          city?: string;
          state?: string;
          country?: string;
        };
      },
      { prisma }: Context
    ): Promise<Ministry> => {
      // Validate EIN format if provided (XX-XXXXXXX)
      if (input.ein && !/^\d{2}-\d{7}$/.test(input.ein)) {
        throw new Error('Invalid EIN format. Expected format: XX-XXXXXXX');
      }

      return prisma.ministry.create({
        data: {
          name: input.name,
          ein: input.ein,
          category: input.category as Prisma.EnumMinistryCategoryFieldUpdateOperationsInput['set'],
          description: input.description,
          mission: input.mission,
          website: input.website,
          city: input.city,
          state: input.state,
          country: input.country ?? 'USA',
          verified: false,
          active: true,
        },
      });
    },

    /**
     * Updates an existing ministry
     * Returns null if ministry not found
     */
    updateMinistry: async (
      _parent: unknown,
      {
        id,
        input,
      }: {
        id: number;
        input: Partial<{
          name: string;
          ein: string;
          category: string;
          description: string;
          mission: string;
          website: string;
          city: string;
          state: string;
          country: string;
          verified: boolean;
          active: boolean;
        }>;
      },
      { prisma }: Context
    ): Promise<Ministry | null> => {
      // Check if ministry exists
      const existing = await prisma.ministry.findUnique({ where: { id } });
      if (!existing) {
        return null;
      }

      // Build update data, only including provided fields
      const data: Prisma.MinistryUpdateInput = {};
      if (input.name !== undefined) data.name = input.name;
      if (input.ein !== undefined) data.ein = input.ein;
      if (input.category !== undefined) {
        data.category = input.category as Prisma.EnumMinistryCategoryFieldUpdateOperationsInput['set'];
      }
      if (input.description !== undefined) data.description = input.description;
      if (input.mission !== undefined) data.mission = input.mission;
      if (input.website !== undefined) data.website = input.website;
      if (input.city !== undefined) data.city = input.city;
      if (input.state !== undefined) data.state = input.state;
      if (input.country !== undefined) data.country = input.country;
      if (input.verified !== undefined) data.verified = input.verified;
      if (input.active !== undefined) data.active = input.active;

      return prisma.ministry.update({
        where: { id },
        data,
      });
    },

    /**
     * Deletes a ministry by ID
     * Will throw if ministry has associated grants (referential integrity)
     */
    deleteMinistry: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<boolean> => {
      try {
        await prisma.ministry.delete({ where: { id } });
        return true;
      } catch (error) {
        // Check if it's a foreign key constraint error
        if (
          error instanceof Error &&
          error.message.includes('Foreign key constraint')
        ) {
          throw new Error(
            'Cannot delete ministry with existing grants. Remove or reassign grants first.'
          );
        }
        throw error;
      }
    },

    /**
     * Marks a ministry as verified for grant eligibility
     */
    verifyMinistry: async (
      _parent: unknown,
      { id }: { id: number },
      { prisma }: Context
    ): Promise<Ministry | null> => {
      const ministry = await prisma.ministry.findUnique({ where: { id } });
      if (!ministry) {
        return null;
      }

      return prisma.ministry.update({
        where: { id },
        data: { verified: true },
      });
    },
  },

  /**
   * Field resolvers for computed fields on Ministry type
   */
  Ministry: {
    /**
     * Resolves all grants for this ministry
     */
    grants: async (parent: Ministry, _args: unknown, { prisma }: Context) => {
      return prisma.grant.findMany({
        where: { ministryId: parent.id },
        orderBy: { requestedAt: 'desc' },
      });
    },

    /**
     * Calculates total funded amount for this ministry
     */
    totalFunded: async (
      parent: Ministry,
      _args: unknown,
      { prisma }: Context
    ) => {
      const result = await prisma.grant.aggregate({
        where: {
          ministryId: parent.id,
          status: 'FUNDED',
        },
        _sum: { amount: true },
      });
      return result._sum.amount ?? 0;
    },

    /**
     * Returns grant counts by status for this ministry
     */
    grantCounts: async (
      parent: Ministry,
      _args: unknown,
      { prisma }: Context
    ) => {
      const counts = await prisma.grant.groupBy({
        by: ['status'],
        where: { ministryId: parent.id },
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
