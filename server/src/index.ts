/**
 * =============================================================================
 * NCF Grant Management Demo - GraphQL Server
 * =============================================================================
 *
 * Entry point for the Apollo Server GraphQL API.
 *
 * This server demonstrates:
 *   - Apollo Server 4 with standalone HTTP server
 *   - Type-safe resolvers with TypeScript
 *   - Prisma ORM for PostgreSQL database access
 *   - Custom scalar types (DateTime, Decimal)
 *   - Relay-style cursor pagination
 *   - Proper error handling and validation
 *
 * For a production deployment, this server would be:
 *   - Deployed to Vercel as a serverless function
 *   - Or deployed to Railway/Render as a Node.js service
 *   - Protected with authentication middleware
 *   - Monitored with Apollo Studio
 *
 * @author Tom Hundley
 * @see https://github.com/tomhundley/ncf-grant-demo
 */

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { createContext } from './context.js';

/**
 * Server configuration
 */
const PORT = parseInt(process.env['PORT'] ?? '4000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

/**
 * Initialize and start the Apollo Server
 */
async function startServer(): Promise<void> {
  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Enable introspection in development (disabled in production for security)
    introspection: NODE_ENV !== 'production',
    // Format errors for consistent client handling
    formatError: (formattedError, error) => {
      // Log errors in development
      if (NODE_ENV === 'development') {
        console.error('GraphQL Error:', error);
      }

      // Return formatted error to client
      // In production, you might want to mask internal errors
      return formattedError;
    },
  });

  // Start the standalone HTTP server
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async () => createContext(),
  });

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 NCF Grant Management GraphQL Server                    ║
║                                                              ║
║   Server ready at: ${url.padEnd(38)}║
║   Environment: ${NODE_ENV.padEnd(43)}║
║                                                              ║
║   Explore the API with Apollo Sandbox:                       ║
║   ${url.padEnd(58)}║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
