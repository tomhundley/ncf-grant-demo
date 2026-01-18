/**
 * =============================================================================
 * GraphQL API - Vercel Serverless Function
 * =============================================================================
 *
 * Apollo Server 5 GraphQL endpoint for Vercel serverless deployment.
 * Handles all GraphQL operations for the Ministry Grant Tracker.
 *
 * Endpoint: /api/graphql
 */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '@prisma/client';
import { GraphQLScalarType, Kind } from 'graphql';
import type { NextApiRequest, NextApiResponse } from 'next';

// =============================================================================
// DATABASE CLIENT (Singleton for serverless)
// =============================================================================

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// =============================================================================
// CUSTOM SCALARS
// =============================================================================

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO 8601 date-time string',
  parseValue: (value: unknown): Date => {
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (isNaN(date.getTime())) throw new Error('Invalid DateTime value');
      return date;
    }
    throw new Error('DateTime must be a string or number');
  },
  serialize: (value: unknown): string => {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return new Date(value).toISOString();
    throw new Error('DateTime serialization error');
  },
  parseLiteral: (ast): Date => {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(ast.kind === Kind.INT ? parseInt(ast.value, 10) : ast.value);
    }
    throw new Error('DateTime must be a string or number');
  },
});

const DecimalScalar = new GraphQLScalarType({
  name: 'Decimal',
  description: 'Decimal number for financial amounts',
  parseValue: (value: unknown): string => {
    if (typeof value === 'string' || typeof value === 'number') {
      const num = parseFloat(String(value));
      if (isNaN(num)) throw new Error('Invalid Decimal value');
      return String(value);
    }
    throw new Error('Decimal must be a string or number');
  },
  serialize: (value: unknown): string => {
    if (value && typeof value === 'object' && 'toFixed' in value) {
      return (value as { toFixed: (d: number) => string }).toFixed(2);
    }
    if (typeof value === 'number') return value.toFixed(2);
    if (typeof value === 'string') return parseFloat(value).toFixed(2);
    throw new Error('Decimal serialization error');
  },
  parseLiteral: (ast): string => {
    if (ast.kind === Kind.STRING || ast.kind === Kind.FLOAT || ast.kind === Kind.INT) {
      return ast.value;
    }
    throw new Error('Decimal must be a string or number');
  },
});

// =============================================================================
// GRAPHQL SCHEMA (Inline for serverless bundling)
// =============================================================================

const typeDefs = `#graphql
  scalar DateTime
  scalar Decimal

  enum MinistryCategory {
    CHURCH
    MISSIONS
    EDUCATION
    HUMANITARIAN
    YOUTH
    MEDIA
    HEALTHCARE
    ADVOCACY
    OTHER
  }

  enum GrantStatus {
    PENDING
    APPROVED
    FUNDED
    REJECTED
  }

  type Ministry {
    id: Int!
    name: String!
    ein: String
    category: MinistryCategory!
    description: String
    mission: String
    website: String
    city: String
    state: String
    country: String!
    verified: Boolean!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    grants: [Grant!]!
    totalFunded: Decimal!
    grantCounts: GrantCounts!
  }

  type GrantCounts {
    pending: Int!
    approved: Int!
    funded: Int!
    rejected: Int!
    total: Int!
  }

  type Donor {
    id: Int!
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    phone: String
    createdAt: DateTime!
    updatedAt: DateTime!
    givingFunds: [GivingFund!]!
    totalBalance: Decimal!
  }

  type GivingFund {
    id: Int!
    name: String!
    description: String
    balance: Decimal!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    donor: Donor!
    donorId: Int!
    grants: [Grant!]!
    totalDisbursed: Decimal!
    grantCounts: GrantCounts!
  }

  type Grant {
    id: Int!
    amount: Decimal!
    status: GrantStatus!
    purpose: String
    notes: String
    requestedAt: DateTime!
    approvedAt: DateTime
    fundedAt: DateTime
    rejectedAt: DateTime
    updatedAt: DateTime!
    givingFund: GivingFund!
    givingFundId: Int!
    ministry: Ministry!
    ministryId: Int!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int!
  }

  type MinistryEdge {
    node: Ministry!
    cursor: String!
  }

  type MinistryConnection {
    edges: [MinistryEdge!]!
    pageInfo: PageInfo!
  }

  type DashboardStats {
    totalMinistries: Int!
    verifiedMinistries: Int!
    totalDonors: Int!
    totalFunds: Int!
    totalBalance: Decimal!
    totalDisbursed: Decimal!
    pendingAmount: Decimal!
    grantsByStatus: GrantCounts!
  }

  input MinistryFilter {
    category: MinistryCategory
    verified: Boolean
    active: Boolean
    search: String
    state: String
  }

  input CreateMinistryInput {
    name: String!
    ein: String
    category: MinistryCategory!
    description: String
    mission: String
    website: String
    city: String
    state: String
    country: String
  }

  input UpdateMinistryInput {
    name: String
    ein: String
    category: MinistryCategory
    description: String
    mission: String
    website: String
    city: String
    state: String
    country: String
    verified: Boolean
    active: Boolean
  }

  input CreateDonorInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String
  }

  input CreateGivingFundInput {
    name: String!
    description: String
    initialBalance: Decimal
    donorId: Int!
  }

  input CreateGrantInput {
    amount: Decimal!
    purpose: String
    givingFundId: Int!
    ministryId: Int!
  }

  type Query {
    ministry(id: Int!): Ministry
    ministries(filter: MinistryFilter, first: Int, after: String): MinistryConnection!
    donor(id: Int!): Donor
    donors: [Donor!]!
    givingFund(id: Int!): GivingFund
    givingFunds(donorId: Int): [GivingFund!]!
    grant(id: Int!): Grant
    grants(status: GrantStatus, ministryId: Int, givingFundId: Int): [Grant!]!
    dashboardStats: DashboardStats!
  }

  type Mutation {
    createMinistry(input: CreateMinistryInput!): Ministry!
    updateMinistry(id: Int!, input: UpdateMinistryInput!): Ministry
    deleteMinistry(id: Int!): Boolean!
    verifyMinistry(id: Int!): Ministry
    createDonor(input: CreateDonorInput!): Donor!
    createGivingFund(input: CreateGivingFundInput!): GivingFund!
    addFunds(fundId: Int!, amount: Decimal!): GivingFund
    createGrantRequest(input: CreateGrantInput!): Grant!
    approveGrant(id: Int!): Grant
    rejectGrant(id: Int!, reason: String): Grant
    fundGrant(id: Int!): Grant
  }
`;

// =============================================================================
// RESOLVERS
// =============================================================================

interface MinistryFilter {
  category?: string;
  verified?: boolean;
  active?: boolean;
  search?: string;
  state?: string;
}

const resolvers = {
  DateTime: DateTimeScalar,
  Decimal: DecimalScalar,

  Query: {
    ministry: async (_: unknown, { id }: { id: number }) => {
      return prisma.ministry.findUnique({ where: { id } });
    },

    ministries: async (
      _: unknown,
      { filter, first = 20, after }: { filter?: MinistryFilter; first?: number; after?: string }
    ) => {
      const take = Math.min(first, 100);
      const where: Record<string, unknown> = {};

      if (filter) {
        if (filter.category) where.category = filter.category;
        if (filter.verified !== undefined) where.verified = filter.verified;
        if (filter.active !== undefined) where.active = filter.active;
        if (filter.state) where.state = filter.state;
        if (filter.search) {
          where.name = { contains: filter.search, mode: 'insensitive' };
        }
      }

      const cursor = after ? { id: parseInt(Buffer.from(after, 'base64').toString()) } : undefined;
      const items = await prisma.ministry.findMany({
        where,
        take: take + 1,
        skip: cursor ? 1 : 0,
        cursor,
        orderBy: { id: 'asc' },
      });

      const hasNextPage = items.length > take;
      const edges = items.slice(0, take).map((item) => ({
        node: item,
        cursor: Buffer.from(String(item.id)).toString('base64'),
      }));

      const totalCount = await prisma.ministry.count({ where });

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

    donor: async (_: unknown, { id }: { id: number }) => {
      return prisma.donor.findUnique({ where: { id } });
    },

    donors: async () => {
      return prisma.donor.findMany({ orderBy: { lastName: 'asc' } });
    },

    givingFund: async (_: unknown, { id }: { id: number }) => {
      return prisma.givingFund.findUnique({ where: { id } });
    },

    givingFunds: async (_: unknown, { donorId }: { donorId?: number }) => {
      const where = donorId ? { donorId } : {};
      return prisma.givingFund.findMany({ where, orderBy: { name: 'asc' } });
    },

    grant: async (_: unknown, { id }: { id: number }) => {
      return prisma.grant.findUnique({ where: { id } });
    },

    grants: async (
      _: unknown,
      { status, ministryId, givingFundId }: { status?: string; ministryId?: number; givingFundId?: number }
    ) => {
      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (ministryId) where.ministryId = ministryId;
      if (givingFundId) where.givingFundId = givingFundId;
      return prisma.grant.findMany({ where, orderBy: { requestedAt: 'desc' } });
    },

    dashboardStats: async () => {
      const [
        totalMinistries,
        verifiedMinistries,
        totalDonors,
        totalFunds,
        fundsAgg,
        grantStats,
      ] = await Promise.all([
        prisma.ministry.count(),
        prisma.ministry.count({ where: { verified: true } }),
        prisma.donor.count(),
        prisma.givingFund.count(),
        prisma.givingFund.aggregate({ _sum: { balance: true } }),
        prisma.grant.groupBy({
          by: ['status'],
          _count: true,
          _sum: { amount: true },
        }),
      ]);

      const statusCounts = { pending: 0, approved: 0, funded: 0, rejected: 0 };
      let totalDisbursed = 0;
      let pendingAmount = 0;

      for (const stat of grantStats) {
        const status = stat.status.toLowerCase() as keyof typeof statusCounts;
        statusCounts[status] = stat._count;
        if (stat.status === 'FUNDED') {
          totalDisbursed = Number(stat._sum.amount || 0);
        }
        if (stat.status === 'PENDING') {
          pendingAmount = Number(stat._sum.amount || 0);
        }
      }

      return {
        totalMinistries,
        verifiedMinistries,
        totalDonors,
        totalFunds,
        totalBalance: Number(fundsAgg._sum.balance || 0),
        totalDisbursed,
        pendingAmount,
        grantsByStatus: {
          ...statusCounts,
          total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
        },
      };
    },
  },

  Mutation: {
    createMinistry: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      return prisma.ministry.create({
        data: { ...input, country: (input.country as string) || 'USA' } as any,
      });
    },

    updateMinistry: async (_: unknown, { id, input }: { id: number; input: Record<string, unknown> }) => {
      return prisma.ministry.update({ where: { id }, data: input as any });
    },

    deleteMinistry: async (_: unknown, { id }: { id: number }) => {
      await prisma.ministry.delete({ where: { id } });
      return true;
    },

    verifyMinistry: async (_: unknown, { id }: { id: number }) => {
      return prisma.ministry.update({ where: { id }, data: { verified: true } });
    },

    createDonor: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      return prisma.donor.create({ data: input as any });
    },

    createGivingFund: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      const { initialBalance, ...data } = input;
      return prisma.givingFund.create({
        data: { ...data, balance: (initialBalance as number) || 0 } as any,
      });
    },

    addFunds: async (_: unknown, { fundId, amount }: { fundId: number; amount: string }) => {
      return prisma.givingFund.update({
        where: { id: fundId },
        data: { balance: { increment: parseFloat(amount) } },
      });
    },

    createGrantRequest: async (_: unknown, { input }: { input: Record<string, unknown> }) => {
      return prisma.grant.create({
        data: {
          amount: parseFloat(input.amount as string),
          purpose: input.purpose as string,
          givingFundId: input.givingFundId as number,
          ministryId: input.ministryId as number,
          status: 'PENDING',
        },
      });
    },

    approveGrant: async (_: unknown, { id }: { id: number }) => {
      return prisma.grant.update({
        where: { id },
        data: { status: 'APPROVED', approvedAt: new Date() },
      });
    },

    rejectGrant: async (_: unknown, { id, reason }: { id: number; reason?: string }) => {
      return prisma.grant.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          notes: reason || null,
        },
      });
    },

    fundGrant: async (_: unknown, { id }: { id: number }) => {
      return prisma.$transaction(async (tx) => {
        const grant = await tx.grant.findUnique({
          where: { id },
          include: { givingFund: true },
        });

        if (!grant) throw new Error('Grant not found');
        if (grant.status !== 'APPROVED') throw new Error('Grant must be approved first');
        if (Number(grant.givingFund.balance) < Number(grant.amount)) {
          throw new Error('Insufficient fund balance');
        }

        await tx.givingFund.update({
          where: { id: grant.givingFundId },
          data: { balance: { decrement: Number(grant.amount) } },
        });

        return tx.grant.update({
          where: { id },
          data: { status: 'FUNDED', fundedAt: new Date() },
        });
      });
    },
  },

  // Type resolvers for nested data
  Ministry: {
    grants: async (parent: { id: number }) => {
      return prisma.grant.findMany({ where: { ministryId: parent.id } });
    },
    totalFunded: async (parent: { id: number }) => {
      const agg = await prisma.grant.aggregate({
        where: { ministryId: parent.id, status: 'FUNDED' },
        _sum: { amount: true },
      });
      return Number(agg._sum.amount || 0);
    },
    grantCounts: async (parent: { id: number }) => {
      const counts = await prisma.grant.groupBy({
        by: ['status'],
        where: { ministryId: parent.id },
        _count: true,
      });
      const result = { pending: 0, approved: 0, funded: 0, rejected: 0, total: 0 };
      for (const c of counts) {
        result[c.status.toLowerCase() as keyof typeof result] = c._count;
        result.total += c._count;
      }
      return result;
    },
  },

  Donor: {
    fullName: (parent: { firstName: string; lastName: string }) => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    givingFunds: async (parent: { id: number }) => {
      return prisma.givingFund.findMany({ where: { donorId: parent.id } });
    },
    totalBalance: async (parent: { id: number }) => {
      const agg = await prisma.givingFund.aggregate({
        where: { donorId: parent.id },
        _sum: { balance: true },
      });
      return Number(agg._sum.balance || 0);
    },
  },

  GivingFund: {
    donor: async (parent: { donorId: number }) => {
      return prisma.donor.findUnique({ where: { id: parent.donorId } });
    },
    grants: async (parent: { id: number }) => {
      return prisma.grant.findMany({ where: { givingFundId: parent.id } });
    },
    totalDisbursed: async (parent: { id: number }) => {
      const agg = await prisma.grant.aggregate({
        where: { givingFundId: parent.id, status: 'FUNDED' },
        _sum: { amount: true },
      });
      return Number(agg._sum.amount || 0);
    },
    grantCounts: async (parent: { id: number }) => {
      const counts = await prisma.grant.groupBy({
        by: ['status'],
        where: { givingFundId: parent.id },
        _count: true,
      });
      const result = { pending: 0, approved: 0, funded: 0, rejected: 0, total: 0 };
      for (const c of counts) {
        result[c.status.toLowerCase() as keyof typeof result] = c._count;
        result.total += c._count;
      }
      return result;
    },
  },

  Grant: {
    ministry: async (parent: { ministryId: number }) => {
      return prisma.ministry.findUnique({ where: { id: parent.ministryId } });
    },
    givingFund: async (parent: { givingFundId: number }) => {
      return prisma.givingFund.findUnique({ where: { id: parent.givingFundId } });
    },
  },
};

// =============================================================================
// APOLLO SERVER SETUP
// =============================================================================

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

// Handle requests manually for Vercel Edge/Serverless
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight
  const method = req.method as string;
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Create handler
  const apolloHandler = startServerAndCreateNextHandler(server, {
    context: async () => ({ prisma }),
  });

  return apolloHandler(req, res);
}
