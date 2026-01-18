/**
 * =============================================================================
 * Grants Page (Premium Edition)
 * =============================================================================
 *
 * Grant management interface allowing filtering and processing of grants.
 * Features a mobile-optimized card view and desktop table view.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { APPROVE_GRANT, REJECT_GRANT, CREATE_GRANT_REQUEST } from "../graphql/mutations";
import { LIST_GRANTS, GET_DASHBOARD_STATS } from "../graphql/queries";
import { GrantStatusBadge } from "../components/GrantStatusBadge";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { GrantRequestForm } from "../components/GrantRequestForm";
import { ViewToggle } from "../components/ViewToggle";

/**
 * Format currency helper
 */
function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Grants Page Component
 */
export function GrantsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreating, setIsCreating] = useState(false);

  // Data fetching
  const { data, loading, error } = useQuery(LIST_GRANTS, {
    variables: { status: statusFilter === "ALL" ? undefined : statusFilter },
  });

  // Mutation for processing grants
  // Mutations
  const [approveGrant] = useMutation(APPROVE_GRANT, {
    refetchQueries: [
      {
        query: LIST_GRANTS,
        variables: {
          status: statusFilter === "ALL" ? undefined : statusFilter,
        },
      },
      { query: GET_DASHBOARD_STATS },
    ],
  });

  const [rejectGrant] = useMutation(REJECT_GRANT, {
    refetchQueries: [
      {
        query: LIST_GRANTS,
        variables: {
          status: statusFilter === "ALL" ? undefined : statusFilter,
        },
      },
      { query: GET_DASHBOARD_STATS },
    ],
  });

  const [createGrantRequest, { loading: createLoading }] = useMutation(CREATE_GRANT_REQUEST, {
    refetchQueries: [
      {
        query: LIST_GRANTS,
        variables: {
          status: statusFilter === "ALL" ? undefined : statusFilter,
        },
      },
      { query: GET_DASHBOARD_STATS },
    ],
  });

  const handleCreateGrant = async (data: {
    ministryId: number;
    givingFundId: number;
    amount: string;
    purpose: string;
  }) => {
    try {
      await createGrantRequest({
        variables: {
          input: {
            ministryId: data.ministryId,
            givingFundId: data.givingFundId,
            amount: data.amount,
            purpose: data.purpose,
          },
        },
      });
      setIsCreating(false);
    } catch (e) {
      console.error("Error creating grant request:", e);
    }
  };

  const handleProcess = async (id: number, approved: boolean) => {
    try {
      if (approved) {
        await approveGrant({ variables: { id } });
      } else {
        await rejectGrant({
          variables: { id, reason: "Rejected via Grant Dashboard" },
        });
      }
    } catch (e) {
      console.error("Error processing grant:", e);
    }
  };

  const grants = data?.grants || [];

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <ErrorMessage message="Error loading grants" details={error.message} />
    );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-1">
            Grant Requests
          </h1>
          <p className="text-slate-400 text-sm">
            Manage and process funding allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-premium bg-midnight-800 border-white/10 text-slate-200 py-2 pl-3 pr-8 rounded-lg focus:ring-electric-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />

          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary py-2 px-4 shadow-lg shadow-electric-blue-600/20"
          >
            <span className="mr-2 text-lg leading-none">+</span>
            New Request
          </button>
        </div>
      </div>

      {isCreating && (
        <GrantRequestForm
          onSubmit={handleCreateGrant}
          onCancel={() => setIsCreating(false)}
          loading={createLoading}
        />
      )}

      {/* Card View - Always visible on mobile, conditional on desktop */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${viewMode === 'list' ? 'md:hidden' : ''}`}>
        {grants.map((grant: any) => (
          <div
            key={grant.id}
            className="glass-panel p-5 relative overflow-hidden group"
          >
            {/* Status Indicator Strip */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-1 ${
                grant.status === "APPROVED"
                  ? "bg-neon-green-500"
                  : grant.status === "REJECTED"
                    ? "bg-red-500"
                    : "bg-cyber-gold-500"
              }`}
            ></div>

            <div className="pl-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-lg">
                  {grant.ministry.name}
                </span>
                <GrantStatusBadge status={grant.status} />
              </div>

              <div className="text-2xl font-serif font-bold text-electric-blue-400 mb-2">
                {formatCurrency(grant.amount)}
              </div>

              <div className="text-sm text-slate-400 mb-4">
                <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
                  Purpose
                </span>
                {grant.purpose}
              </div>

              <div className="flex items-center text-xs text-slate-500 mb-4 border-t border-white/5 pt-3">
                <span className="uppercase tracking-wider mr-2">From:</span>
                <span className="text-slate-300 font-medium">
                  {grant.givingFund.name}
                </span>
              </div>

              {grant.status === "PENDING" && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => handleProcess(grant.id, true)}
                    className="flex items-center justify-center py-3 bg-neon-green-600/20 text-neon-green-400 border border-neon-green-600/50 rounded-lg hover:bg-neon-green-600 hover:text-white transition-all active:scale-95"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleProcess(grant.id, false)}
                    className="flex items-center justify-center py-3 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600 hover:text-white transition-all active:scale-95"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* List View - Hidden on mobile, visible on desktop when selected */}
      {viewMode === 'list' && (
      <div className="hidden md:block glass-panel overflow-hidden">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-midnight-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Ministry
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Purpose
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {grants.map((grant: any) => (
              <tr key={grant.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-white">
                    {grant.ministry.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Fund: {grant.givingFund.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-serif text-electric-blue-400 font-bold">
                  {formatCurrency(grant.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300 max-w-sm truncate">
                  {grant.purpose}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <GrantStatusBadge status={grant.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {grant.status === "PENDING" && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleProcess(grant.id, true)}
                        className="p-2 text-neon-green-400 hover:text-white hover:bg-neon-green-600 rounded-full transition-colors"
                        title="Approve"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleProcess(grant.id, false)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-full transition-colors"
                        title="Reject"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {grants.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No grants found matching criteria.
          </div>
        )}
      </div>
      )}

      {/* Empty state for card view */}
      {viewMode === 'card' && grants.length === 0 && (
        <div className="glass-panel text-center py-12 text-slate-500">
          No grants found matching criteria.
        </div>
      )}
    </div>
  );
}
