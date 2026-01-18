/**
 * =============================================================================
 * Apollo Client Configuration
 * =============================================================================
 *
 * Sets up the Apollo Client for GraphQL operations with:
 *   - HTTP link to the GraphQL server
 *   - In-memory cache with type policies
 *   - Error handling for network and GraphQL errors
 *
 * Cache Configuration:
 * - Uses Relay-style cursor pagination for ministries
 * - Caches query results for performance
 * - Automatic cache updates on mutations
 *
 * @see https://www.apollographql.com/docs/react/
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';

/**
 * GraphQL server endpoint
 * In development, this is proxied by Vite to localhost:5051
 * In production, this should be the deployed API URL
 */
const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI ?? '/graphql';

/**
 * HTTP link for sending GraphQL operations
 */
const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
  // Include credentials for cookie-based auth (if implemented)
  credentials: 'same-origin',
});

/**
 * Error handling link
 * Logs errors in development and provides user-friendly error handling
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL Error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError}`);
  }
});

/**
 * Apollo Client cache configuration
 * Implements type policies for optimal cache behavior
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Use Relay-style pagination for ministries list
        ministries: relayStylePagination(['filter']),
      },
    },
    // Define key fields for proper cache normalization
    Ministry: {
      keyFields: ['id'],
    },
    Donor: {
      keyFields: ['id'],
    },
    GivingFund: {
      keyFields: ['id'],
    },
    Grant: {
      keyFields: ['id'],
    },
  },
});

/**
 * Apollo Client instance
 * Exported for use throughout the application
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
  // Enable Apollo DevTools in development
  connectToDevTools: import.meta.env.DEV,
  // Default options for queries
  defaultOptions: {
    watchQuery: {
      // Fetch data from cache first, then network
      fetchPolicy: 'cache-and-network',
      // Re-render component when cache is updated
      nextFetchPolicy: 'cache-first',
    },
    query: {
      // Fetch from network by default for queries
      fetchPolicy: 'network-only',
    },
  },
});
