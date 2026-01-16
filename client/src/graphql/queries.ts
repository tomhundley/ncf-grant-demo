/**
 * =============================================================================
 * GraphQL Queries
 * =============================================================================
 *
 * All GraphQL query operations for the NCF Grant Management demo.
 * Queries are organized by entity type for easy maintenance.
 *
 * Naming Convention:
 *   - GET_* for fetching single entities
 *   - LIST_* for fetching collections
 *   - SEARCH_* for filtered/searched collections
 *
 * @see https://graphql.org/learn/queries/
 */

import { gql } from '@apollo/client';

// =============================================================================
// Fragments - Reusable field selections
// =============================================================================

/**
 * Core ministry fields used across multiple queries
 */
export const MINISTRY_CORE_FIELDS = gql`
  fragment MinistryCoreFields on Ministry {
    id
    name
    ein
    category
    description
    mission
    website
    city
    state
    verified
    active
    createdAt
    updatedAt
  }
`;

/**
 * Core donor fields
 */
export const DONOR_CORE_FIELDS = gql`
  fragment DonorCoreFields on Donor {
    id
    firstName
    lastName
    email
    phone
    createdAt
  }
`;

/**
 * Core giving fund fields
 */
export const GIVING_FUND_CORE_FIELDS = gql`
  fragment GivingFundCoreFields on GivingFund {
    id
    name
    description
    balance
    active
    createdAt
  }
`;

/**
 * Core grant fields
 */
export const GRANT_CORE_FIELDS = gql`
  fragment GrantCoreFields on Grant {
    id
    amount
    status
    purpose
    notes
    createdAt
    approvedAt
    fundedAt
    rejectedAt
  }
`;

// =============================================================================
// Dashboard Queries
// =============================================================================

/**
 * Fetch dashboard statistics
 * Aggregates key metrics for the overview dashboard
 */
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalMinistries
      verifiedMinistries
      totalDonors
      totalFunds
      totalBalance
      pendingAmount
    }
  }
`;

// =============================================================================
// Ministry Queries
// =============================================================================

/**
 * List ministries with cursor-based pagination
 * Supports filtering by category, verification status, and search term
 */
export const LIST_MINISTRIES = gql`
  ${MINISTRY_CORE_FIELDS}
  query ListMinistries(
    $first: Int
    $after: String
    $filter: MinistryFilter
  ) {
    ministries(first: $first, after: $after, filter: $filter) {
      edges {
        cursor
        node {
          ...MinistryCoreFields
          totalFunded
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/**
 * Get a single ministry by ID
 * Includes related grants for detail view
 */
export const GET_MINISTRY = gql`
  ${MINISTRY_CORE_FIELDS}
  ${GRANT_CORE_FIELDS}
  query GetMinistry($id: Int!) {
    ministry(id: $id) {
      ...MinistryCoreFields
      totalFunded
      grants {
        ...GrantCoreFields
        givingFund {
          id
          name
        }
      }
    }
  }
`;

// =============================================================================
// Donor Queries
// =============================================================================

/**
 * List all donors with their giving funds
 */
export const LIST_DONORS = gql`
  ${DONOR_CORE_FIELDS}
  ${GIVING_FUND_CORE_FIELDS}
  query ListDonors {
    donors {
      ...DonorCoreFields
      totalContributions
      givingFunds {
        ...GivingFundCoreFields
      }
    }
  }
`;

/**
 * Get a single donor by ID
 * Includes complete giving fund and grant history
 */
export const GET_DONOR = gql`
  ${DONOR_CORE_FIELDS}
  ${GIVING_FUND_CORE_FIELDS}
  ${GRANT_CORE_FIELDS}
  query GetDonor($id: Int!) {
    donor(id: $id) {
      ...DonorCoreFields
      totalContributions
      givingFunds {
        ...GivingFundCoreFields
        grants {
          ...GrantCoreFields
          ministry {
            id
            name
          }
        }
      }
    }
  }
`;

// =============================================================================
// Giving Fund Queries
// =============================================================================

/**
 * Get a single giving fund by ID
 * Includes grant history and donor information
 */
export const GET_GIVING_FUND = gql`
  ${GIVING_FUND_CORE_FIELDS}
  ${GRANT_CORE_FIELDS}
  query GetGivingFund($id: Int!) {
    givingFund(id: $id) {
      ...GivingFundCoreFields
      donor {
        id
        firstName
        lastName
      }
      grants {
        ...GrantCoreFields
        ministry {
          id
          name
        }
      }
    }
  }
`;

// =============================================================================
// Grant Queries
// =============================================================================

/**
 * List grants with optional filtering
 * Supports filtering by status and ministry
 */
export const LIST_GRANTS = gql`
  ${GRANT_CORE_FIELDS}
  query ListGrants($status: GrantStatus, $ministryId: Int) {
    grants(status: $status, ministryId: $ministryId) {
      ...GrantCoreFields
      ministry {
        id
        name
        category
      }
      givingFund {
        id
        name
        donor {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

/**
 * Get a single grant by ID
 * Full detail view including all related entities
 */
export const GET_GRANT = gql`
  ${GRANT_CORE_FIELDS}
  ${MINISTRY_CORE_FIELDS}
  query GetGrant($id: Int!) {
    grant(id: $id) {
      ...GrantCoreFields
      ministry {
        ...MinistryCoreFields
      }
      givingFund {
        id
        name
        balance
        donor {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`;
