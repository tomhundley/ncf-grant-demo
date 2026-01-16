/**
 * =============================================================================
 * GraphQL Resolvers Index
 * =============================================================================
 *
 * Combines all resolver modules into a single resolvers object.
 * Uses deep merge to combine Query, Mutation, and type resolvers.
 *
 * Architecture:
 *   - Each domain (ministry, donor, fund, grant) has its own resolver file
 *   - Resolvers are combined here for the Apollo Server configuration
 *   - Custom scalars are defined for DateTime and Decimal handling
 */

import { GraphQLScalarType, Kind } from 'graphql';
import { ministryResolvers } from './ministry.resolvers.js';
import { donorResolvers } from './donor.resolvers.js';
import { givingFundResolvers } from './givingFund.resolvers.js';
import { grantResolvers } from './grant.resolvers.js';
import { dashboardResolvers } from './dashboard.resolvers.js';

/**
 * Custom DateTime scalar for ISO 8601 date strings
 */
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO 8601 date-time string',

  // Value from client → internal value
  parseValue(value: unknown): Date {
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid DateTime value');
      }
      return date;
    }
    throw new Error('DateTime must be a string or number');
  },

  // Internal value → value for client
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string') {
      return new Date(value).toISOString();
    }
    throw new Error('DateTime serialization error');
  },

  // Value from AST (hardcoded in query)
  parseLiteral(ast): Date {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(ast.kind === Kind.INT ? parseInt(ast.value, 10) : ast.value);
    }
    throw new Error('DateTime must be a string or number');
  },
});

/**
 * Custom Decimal scalar for precise financial amounts
 */
const DecimalScalar = new GraphQLScalarType({
  name: 'Decimal',
  description: 'Decimal number with precision for financial amounts',

  // Value from client → internal value
  parseValue(value: unknown): string {
    if (typeof value === 'string' || typeof value === 'number') {
      const num = parseFloat(String(value));
      if (isNaN(num)) {
        throw new Error('Invalid Decimal value');
      }
      return String(value);
    }
    throw new Error('Decimal must be a string or number');
  },

  // Internal value → value for client
  serialize(value: unknown): string {
    // Handle Prisma Decimal objects
    if (value && typeof value === 'object' && 'toFixed' in value) {
      return (value as { toFixed: (digits: number) => string }).toFixed(2);
    }
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (typeof value === 'string') {
      return parseFloat(value).toFixed(2);
    }
    throw new Error('Decimal serialization error');
  },

  // Value from AST (hardcoded in query)
  parseLiteral(ast): string {
    if (ast.kind === Kind.STRING || ast.kind === Kind.FLOAT || ast.kind === Kind.INT) {
      return ast.value;
    }
    throw new Error('Decimal must be a string or number');
  },
});

/**
 * Helper to deep merge resolver objects
 */
function mergeResolvers(
  ...resolvers: Array<Record<string, unknown>>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const resolver of resolvers) {
    for (const [key, value] of Object.entries(resolver)) {
      if (
        result[key] &&
        typeof result[key] === 'object' &&
        typeof value === 'object' &&
        value !== null
      ) {
        // Deep merge objects (Query, Mutation, type resolvers)
        result[key] = {
          ...(result[key] as Record<string, unknown>),
          ...(value as Record<string, unknown>),
        };
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Combined resolvers object for Apollo Server
 */
export const resolvers = mergeResolvers(
  // Custom scalars
  {
    DateTime: DateTimeScalar,
    Decimal: DecimalScalar,
  },
  // Domain resolvers
  ministryResolvers,
  donorResolvers,
  givingFundResolvers,
  grantResolvers,
  dashboardResolvers
);
