/**
 * =============================================================================
 * Application Entry Point
 * =============================================================================
 *
 * Main entry point for the React application. Sets up:
 *   - Apollo Client provider for GraphQL operations
 *   - React Router for client-side navigation
 *   - Global styles via Tailwind CSS
 *
 * @author Tom Hundley
 * @see https://github.com/tomhundley/ncf-grant-demo
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { apolloClient } from './lib/apollo';
import App from './App';
import './index.css';

/**
 * Render the application with all required providers
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
