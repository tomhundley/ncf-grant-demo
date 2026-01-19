/**
 * =============================================================================
 * GraphQL Mutations
 * =============================================================================
 *
 * All GraphQL mutation operations for the NCF Grant Management demo.
 * Mutations are organized by entity type and follow CRUD patterns.
 *
 * Naming Convention:
 *   - CREATE_* for creating new entities
 *   - UPDATE_* for updating existing entities
 *   - DELETE_* for removing entities
 *   - Action verbs for business operations (APPROVE, FUND, REJECT)
 *
 * @see https://graphql.org/learn/queries/#mutations
 */

import { gql } from '@apollo/client';
import {
  MINISTRY_CORE_FIELDS,
  GIVING_FUND_CORE_FIELDS,
  GRANT_CORE_FIELDS,
} from './queries';

// =============================================================================
// Ministry Mutations
// =============================================================================

/**
 * Create a new ministry
 * Returns the created ministry with all core fields
 */
export const CREATE_MINISTRY = gql`
  ${MINISTRY_CORE_FIELDS}
  mutation CreateMinistry($input: CreateMinistryInput!) {
    createMinistry(input: $input) {
      ...MinistryCoreFields
    }
  }
`;

/**
 * Update an existing ministry
 * Supports partial updates - only provided fields are changed
 */
export const UPDATE_MINISTRY = gql`
  ${MINISTRY_CORE_FIELDS}
  mutation UpdateMinistry($id: Int!, $input: UpdateMinistryInput!) {
    updateMinistry(id: $id, input: $input) {
      ...MinistryCoreFields
    }
  }
`;

/**
 * Delete a ministry
 * Returns true if deletion was successful
 * Note: Cannot delete ministries with active grants
 */
export const DELETE_MINISTRY = gql`
  mutation DeleteMinistry($id: Int!) {
    deleteMinistry(id: $id)
  }
`;

// =============================================================================
// Giving Fund Mutations
// =============================================================================

/**
 * Create a new giving fund for a donor
 */
export const CREATE_GIVING_FUND = gql`
  ${GIVING_FUND_CORE_FIELDS}
  mutation CreateGivingFund($input: CreateGivingFundInput!) {
    createGivingFund(input: $input) {
      ...GivingFundCoreFields
      donor {
        id
        firstName
        lastName
      }
    }
  }
`;

/**
 * Add funds to a giving fund
 * Used for donor contributions
 */
export const ADD_FUNDS = gql`
  ${GIVING_FUND_CORE_FIELDS}
  mutation AddFunds($fundId: Int!, $amount: Decimal!) {
    addFunds(fundId: $fundId, amount: $amount) {
      ...GivingFundCoreFields
    }
  }
`;

// =============================================================================
// Grant Mutations - Full Workflow
// =============================================================================

/**
 * Create a new grant request
 * Initial status will be PENDING
 */
export const CREATE_GRANT_REQUEST = gql`
  ${GRANT_CORE_FIELDS}
  mutation CreateGrantRequest($input: CreateGrantInput!) {
    createGrantRequest(input: $input) {
      ...GrantCoreFields
      ministry {
        id
        name
      }
      givingFund {
        id
        name
        balance
      }
    }
  }
`;

/**
 * Approve a pending grant request
 * Transitions grant from PENDING to APPROVED
 * Validation: Only PENDING grants can be approved
 */
export const APPROVE_GRANT = gql`
  ${GRANT_CORE_FIELDS}
  mutation ApproveGrant($id: Int!) {
    approveGrant(id: $id) {
      ...GrantCoreFields
      ministry {
        id
        name
      }
    }
  }
`;

/**
 * Reject a pending grant request
 * Transitions grant from PENDING to REJECTED
 * Optional reason is stored in notes field
 */
export const REJECT_GRANT = gql`
  ${GRANT_CORE_FIELDS}
  mutation RejectGrant($id: Int!, $reason: String) {
    rejectGrant(id: $id, reason: $reason) {
      ...GrantCoreFields
    }
  }
`;

/**
 * Fund an approved grant
 * Transitions grant from APPROVED to FUNDED
 * IMPORTANT: This mutation:
 *   1. Validates the giving fund has sufficient balance
 *   2. Deducts the grant amount from the giving fund
 *   3. Updates the grant status to FUNDED
 * All operations are atomic (transaction)
 */
export const FUND_GRANT = gql`
  ${GRANT_CORE_FIELDS}
  mutation FundGrant($id: Int!) {
    fundGrant(id: $id) {
      ...GrantCoreFields
      ministry {
        id
        name
      }
      givingFund {
        id
        name
        balance
      }
    }
  }
`;

// =============================================================================
// Donor Mutations
// =============================================================================

/**
 * Create a new donor
 * Typically done as part of onboarding flow
 */
export const CREATE_DONOR = gql`
  mutation CreateDonor($input: CreateDonorInput!) {
    createDonor(input: $input) {
      id
      firstName
      lastName
      email
      phone
      createdAt
    }
  }
`;
