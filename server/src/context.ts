/**
 * =============================================================================
 * GraphQL Context
 * =============================================================================
 *
 * Defines the context object passed to all GraphQL resolvers.
 * Contains the Prisma client instance for database operations.
 *
 * In a production application, this would also include:
 *   - Authenticated user information
 *   - Data loaders for batching/caching
 *   - Request-specific services
 */

import { PrismaClient } from '@prisma/client';

/**
 * Context interface for type-safe resolver access
 */
export interface Context {
  prisma: PrismaClient;
}

/**
 * Singleton Prisma client instance
 * Reused across requests to maintain connection pool
 */
const prisma = new PrismaClient({
  log: process.env['NODE_ENV'] === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});

/**
 * Creates the context object for each GraphQL request
 */
export function createContext(): Context {
  return {
    prisma,
  };
}

/**
 * Export prisma client for use in seed scripts
 */
export { prisma };
