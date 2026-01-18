/**
 * =============================================================================
 * Donors Page (Premium Edition)
 * =============================================================================
 *
 * Page for viewing donors and their giving funds.
 * Refactored for the new premium dark aesthetic.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LIST_DONORS, GET_DASHBOARD_STATS } from "../graphql/queries";
import { ADD_FUNDS } from "../graphql/mutations";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { ViewToggle } from "../components/ViewToggle";

type GivingFund = {
  id: number;
  name: string;
  description: string | null;
  balance: string;
  active: boolean;
};

type Donor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  totalBalance: string;
  givingFunds: GivingFund[];
};

/**
 * Donors Page Component
 */
export function DonorsPage() {
  // View mode state
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // State for add funds modal
  const [selectedFund, setSelectedFund] = useState<GivingFund | null>(null);
  const [addAmount, setAddAmount] = useState("");

  // Fetch donors with their giving funds
  const { data, loading, error } = useQuery(LIST_DONORS);

  // Add funds mutation
  const [addFunds, { loading: adding }] = useMutation(ADD_FUNDS, {
    refetchQueries: [{ query: LIST_DONORS }, { query: GET_DASHBOARD_STATS }],
    onCompleted: () => {
      setSelectedFund(null);
      setAddAmount("");
    },
  });

  // Handle add funds
  const handleAddFunds = async () => {
    if (!selectedFund || !addAmount) return;
    await addFunds({
      variables: {
        fundId: selectedFund.id,
        amount: addAmount,
      },
    });
  };

  // Format currency
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const donors: Donor[] = data?.donors || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-1">
            Donors
          </h1>
          <p className="text-slate-400 text-sm">
            View donors and manage giving funds.
          </p>
        </div>
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message="Failed to load donors" details={error.message} />
      ) : donors.length === 0 ? (
        <div className="glass-panel text-center py-12">
          <p className="text-slate-500 italic">No donors found.</p>
        </div>
      ) : (
        <>
          {/* Card View - Always visible on mobile, conditional on desktop */}
          <div className={`space-y-8 ${viewMode === 'list' ? 'md:hidden' : ''}`}>
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className="glass-panel p-6 border-l-4 border-electric-blue-500"
                >
                  {/* Donor Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {donor.firstName} {donor.lastName}
                        <span className="inline-block px-2 py-0.5 rounded text-xs bg-electric-blue-500/20 text-electric-blue-400 font-normal">
                          Donor
                        </span>
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-slate-400">
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 opacity-70"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {donor.email}
                        </span>
                        {donor.phone && (
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2 opacity-70"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {donor.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-left md:text-right bg-midnight-900/50 p-3 rounded-xl border border-white/5 min-w-[180px]">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        Total Contributions
                      </p>
                      <p className="text-3xl font-serif font-bold text-neon-green-400 text-glow-green">
                        {formatCurrency(donor.totalBalance)}
                      </p>
                    </div>
                  </div>

                  {/* Giving Funds */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                      Giving Funds
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {donor.givingFunds.map((fund) => (
                        <div
                          key={fund.id}
                          className="bg-midnight-900/80 border border-white/10 rounded-xl p-5 hover:border-electric-blue-500/50 transition-colors group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-white text-lg group-hover:text-electric-blue-300 transition-colors">
                                {fund.name}
                              </h4>
                              {fund.description && (
                                <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                                  {fund.description}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                                fund.active
                                  ? "bg-neon-green-500/10 text-neon-green-400 border border-neon-green-500/20"
                                  : "bg-slate-700/50 text-slate-400"
                              }`}
                            >
                              {fund.active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <div className="mt-6 flex justify-between items-end">
                            <div>
                              <p className="text-xs text-slate-500 uppercase mb-0.5">
                                Current Balance
                              </p>
                              <p className="text-2xl font-bold text-white">
                                {formatCurrency(fund.balance)}
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedFund(fund)}
                              className="btn-outline text-xs px-3 py-1.5 border-white/20 hover:bg-electric-blue-600 hover:border-electric-blue-600 hover:text-white text-slate-300"
                            >
                              Add Funds
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* List View - Hidden on mobile, visible on desktop when selected */}
          {viewMode === 'list' && (
            <div className="hidden md:block glass-panel overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-midnight-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Giving Funds
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Total Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {donors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">
                            {donor.firstName} {donor.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-400">
                            <div>{donor.email}</div>
                            {donor.phone && (
                              <div className="text-slate-500">{donor.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {donor.givingFunds.map((fund) => (
                              <button
                                key={fund.id}
                                onClick={() => setSelectedFund(fund)}
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors hover:border-electric-blue-500/50 ${
                                  fund.active
                                    ? "bg-midnight-800 border-white/10 text-white"
                                    : "bg-slate-800/50 border-slate-700 text-slate-500"
                                }`}
                              >
                                <span className="truncate max-w-[100px]">{fund.name}</span>
                                <span className="ml-2 text-electric-blue-400 font-bold">
                                  {formatCurrency(fund.balance)}
                                </span>
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-lg font-bold text-neon-green-400 font-serif">
                            {formatCurrency(donor.totalBalance)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Funds Modal */}
      {selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedFund(null);
              setAddAmount("");
            }}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md bg-midnight-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Add Funds</h2>
              <p className="text-slate-400 mb-6">
                Adding to{" "}
                <span className="text-electric-blue-400 font-bold">
                  {selectedFund.name}
                </span>
              </p>

              <div className="bg-midnight-800 rounded-lg p-4 mb-6 border border-white/5">
                <p className="text-xs text-slate-500 uppercase mb-1">
                  Current Balance
                </p>
                <p className="text-2xl font-serif font-bold text-white">
                  {formatCurrency(selectedFund.balance)}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Amount to Add
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="input-premium bg-midnight-950 border-white/20 pl-8 text-xl w-full"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedFund(null);
                    setAddAmount("");
                  }}
                  className="btn-outline text-sm border-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFunds}
                  disabled={!addAmount || adding}
                  className="btn-primary flex-1 justify-center"
                >
                  {adding ? "Processing..." : "Confirm Transaction"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
