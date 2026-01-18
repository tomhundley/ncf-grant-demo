/**
 * =============================================================================
 * Dashboard Page (Premium Edition)
 * =============================================================================
 *
 * Overview dashboard displaying key metrics and statistics.
 * Refactored for the new premium dark aesthetic.
 */

import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS, LIST_GRANTS } from "../graphql/queries";
import { GrantStatusBadge } from "../components/GrantStatusBadge";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";

/**
 * Format a number as USD currency
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
 * Dashboard Page Component
 */
export function Dashboard() {
  // Fetch dashboard statistics
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useQuery(GET_DASHBOARD_STATS);

  // Fetch recent pending grants
  const {
    data: grantsData,
    loading: grantsLoading,
    error: grantsError,
  } = useQuery(LIST_GRANTS, {
    variables: { status: "PENDING" },
  });

  // Handle loading state
  if (statsLoading || grantsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (statsError || grantsError) {
    return (
      <ErrorMessage
        message="Failed to load dashboard data"
        details={statsError?.message || grantsError?.message}
      />
    );
  }

  const stats = statsData?.dashboardStats;
  const pendingGrants = grantsData?.grants || [];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">
          Command Center
        </h1>
        <p className="text-slate-400">
          Real-time overview of ministry deployment and grant activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Ministries */}
        <StatCard
          title="Total Ministries"
          value={stats?.totalMinistries || 0}
          subtitle={`${stats?.verifiedMinistries || 0} verified & active`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />

        {/* Total Donors */}
        <StatCard
          title="Active Donors"
          value={stats?.totalDonors || 0}
          subtitle={`${stats?.totalFunds || 0} giving funds deployed`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />

        {/* Total Balance */}
        <StatCard
          title="Total Fund Balance"
          value={formatCurrency(stats?.totalBalance || 0)}
          subtitle={`${formatCurrency(stats?.pendingAmount || 0)} pending allocation`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          highlight
        />
      </div>

      {/* Pending Grants Section */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold text-white">
            Pending Grant Requests
          </h2>
          <span className="badge-pending">
            {pendingGrants.length} Awaiting Action
          </span>
        </div>

        {pendingGrants.length === 0 ? (
          <p className="text-slate-500 text-center py-8 italic">
            No pending grant requests. System clear.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Ministry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    From Fund
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {pendingGrants.map(
                  (grant: {
                    id: number;
                    amount: string;
                    purpose: string;
                    status: string;
                    ministry: { id: number; name: string };
                    givingFund: { id: number; name: string };
                  }) => (
                    <tr
                      key={grant.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-bold text-white">
                          {grant.ministry.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                        {grant.givingFund.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-cyber-gold-400">
                        {formatCurrency(grant.amount)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400 max-w-xs truncate">
                        {grant.purpose}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <GrantStatusBadge status={grant.status} />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  title,
  value,
  subtitle,
  icon,
  highlight = false,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`glass-panel p-6 ${
        highlight ? "border-electric-blue-500/30 bg-electric-blue-900/10" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <p
            className={`mt-2 text-4xl font-bold font-serif ${
              highlight ? "text-electric-blue-400 text-glow" : "text-white"
            }`}
          >
            {value}
          </p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div
          className={`p-3 rounded-xl ${
            highlight
              ? "bg-electric-blue-500/20 text-electric-blue-400"
              : "bg-midnight-800 text-slate-400"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
