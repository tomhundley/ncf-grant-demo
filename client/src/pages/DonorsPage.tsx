/**
 * =============================================================================
 * Donors Page
 * =============================================================================
 *
 * Page for viewing donors and their giving funds.
 * Demonstrates:
 *   - Nested data fetching with GraphQL
 *   - Fund balance management
 *   - Add funds mutation
 *
 * @see https://www.apollographql.com/docs/react/data/queries/
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_DONORS, GET_DASHBOARD_STATS } from '../graphql/queries';
import { ADD_FUNDS } from '../graphql/mutations';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

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
  totalContributions: string;
  givingFunds: GivingFund[];
};

/**
 * Donors Page Component
 */
export function DonorsPage() {
  // State for add funds modal
  const [selectedFund, setSelectedFund] = useState<GivingFund | null>(null);
  const [addAmount, setAddAmount] = useState('');

  // Fetch donors with their giving funds
  const { data, loading, error } = useQuery(LIST_DONORS);

  // Add funds mutation
  const [addFunds, { loading: adding }] = useMutation(ADD_FUNDS, {
    refetchQueries: [{ query: LIST_DONORS }, { query: GET_DASHBOARD_STATS }],
    onCompleted: () => {
      setSelectedFund(null);
      setAddAmount('');
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const donors: Donor[] = data?.donors || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
        <p className="mt-1 text-sm text-gray-500">
          View donors and manage giving funds
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message="Failed to load donors" details={error.message} />
      ) : donors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No donors found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {donors.map((donor) => (
            <div key={donor.id} className="card">
              {/* Donor Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {donor.firstName} {donor.lastName}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{donor.email}</span>
                    {donor.phone && <span>{donor.phone}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Contributions</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(donor.totalContributions)}
                  </p>
                </div>
              </div>

              {/* Giving Funds */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Giving Funds
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donor.givingFunds.map((fund) => (
                    <div
                      key={fund.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{fund.name}</h4>
                          {fund.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {fund.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`badge ${
                            fund.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {fund.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Balance</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(fund.balance)}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedFund(fund)}
                          className="btn-primary text-sm"
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
      )}

      {/* Add Funds Modal */}
      {selectedFund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add Funds to {selectedFund.name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Current balance: {formatCurrency(selectedFund.balance)}
            </p>
            <div className="mb-4">
              <label className="label">Amount to Add</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input pl-8"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedFund(null);
                  setAddAmount('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFunds}
                disabled={!addAmount || adding}
                className="btn-primary"
              >
                {adding ? 'Adding...' : 'Add Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
