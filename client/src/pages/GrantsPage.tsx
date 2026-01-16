/**
 * =============================================================================
 * Grants Page
 * =============================================================================
 *
 * Page for viewing and managing grant requests.
 * Demonstrates the full grant workflow:
 *   1. Create grant request (PENDING)
 *   2. Approve or Reject (APPROVED/REJECTED)
 *   3. Fund the grant (FUNDED) - deducts from giving fund balance
 *
 * @see https://www.apollographql.com/docs/react/data/mutations/
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_GRANTS, GET_DASHBOARD_STATS } from '../graphql/queries';
import {
  CREATE_GRANT_REQUEST,
  APPROVE_GRANT,
  REJECT_GRANT,
  FUND_GRANT,
} from '../graphql/mutations';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { GrantStatusBadge } from '../components/GrantStatusBadge';
import { GrantRequestForm } from '../components/GrantRequestForm';

type Grant = {
  id: number;
  amount: string;
  status: 'PENDING' | 'APPROVED' | 'FUNDED' | 'REJECTED';
  purpose: string;
  notes: string | null;
  createdAt: string;
  ministry: { id: number; name: string; category: string };
  givingFund: {
    id: number;
    name: string;
    donor: { id: number; firstName: string; lastName: string };
  };
};

/**
 * Status filter options
 */
const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'FUNDED', label: 'Funded' },
  { value: 'REJECTED', label: 'Rejected' },
];

/**
 * Grants Page Component
 */
export function GrantsPage() {
  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch grants
  const { data, loading, error } = useQuery(LIST_GRANTS, {
    variables: statusFilter ? { status: statusFilter } : {},
  });

  // Mutations
  const [createGrant, { loading: creating }] = useMutation(CREATE_GRANT_REQUEST, {
    refetchQueries: [{ query: LIST_GRANTS }, { query: GET_DASHBOARD_STATS }],
    onCompleted: () => setIsFormOpen(false),
  });

  const [approveGrant, { loading: approving }] = useMutation(APPROVE_GRANT, {
    refetchQueries: [{ query: LIST_GRANTS }, { query: GET_DASHBOARD_STATS }],
  });

  const [rejectGrant, { loading: rejecting }] = useMutation(REJECT_GRANT, {
    refetchQueries: [{ query: LIST_GRANTS }, { query: GET_DASHBOARD_STATS }],
  });

  const [fundGrant, { loading: funding }] = useMutation(FUND_GRANT, {
    refetchQueries: [{ query: LIST_GRANTS }, { query: GET_DASHBOARD_STATS }],
  });

  // Handle grant actions
  const handleApprove = async (id: number) => {
    if (confirm('Approve this grant request?')) {
      await approveGrant({ variables: { id } });
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Enter rejection reason (optional):');
    await rejectGrant({ variables: { id, reason } });
  };

  const handleFund = async (id: number) => {
    if (confirm('Fund this grant? This will deduct the amount from the giving fund.')) {
      try {
        await fundGrant({ variables: { id } });
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to fund grant');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (formData: {
    ministryId: number;
    givingFundId: number;
    amount: string;
    purpose: string;
  }) => {
    await createGrant({
      variables: {
        input: {
          ...formData,
          amount: formData.amount,
        },
      },
    });
  };

  // Format currency
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const grants: Grant[] = data?.grants || [];
  const isProcessing = approving || rejecting || funding;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage grant requests and funding
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Grant Request
        </button>
      </div>

      {/* Status Filter */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grants List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message="Failed to load grants" details={error.message} />
      ) : grants.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No grants found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grants.map((grant) => (
            <div key={grant.id} className="card">
              <div className="flex justify-between items-start">
                {/* Grant Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {grant.ministry.name}
                    </h3>
                    <GrantStatusBadge status={grant.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{grant.purpose}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>
                      <strong className="text-gray-900">
                        {formatCurrency(grant.amount)}
                      </strong>
                    </span>
                    <span>
                      From: {grant.givingFund.name} ({grant.givingFund.donor.firstName}{' '}
                      {grant.givingFund.donor.lastName})
                    </span>
                    <span>Requested: {formatDate(grant.createdAt)}</span>
                  </div>
                  {grant.notes && (
                    <p className="mt-2 text-sm text-gray-500 italic">
                      Note: {grant.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {grant.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(grant.id)}
                        disabled={isProcessing}
                        className="btn-success text-sm px-3 py-1"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(grant.id)}
                        disabled={isProcessing}
                        className="btn-danger text-sm px-3 py-1"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {grant.status === 'APPROVED' && (
                    <button
                      onClick={() => handleFund(grant.id)}
                      disabled={isProcessing}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Fund Grant
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grant Request Form Modal */}
      {isFormOpen && (
        <GrantRequestForm
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          loading={creating}
        />
      )}
    </div>
  );
}
