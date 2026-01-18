/**
 * =============================================================================
 * Grant Request Form Component
 * =============================================================================
 *
 * Form for creating new grant requests.
 * Demonstrates:
 *   - Loading related entities (ministries, giving funds)
 *   - Cascading selections (donor -> giving fund)
 *   - Form validation with business rules
 */

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { LIST_MINISTRIES, LIST_DONORS } from '../graphql/queries';
import { LoadingSpinner } from './LoadingSpinner';

interface GrantRequestFormProps {
  onSubmit: (data: {
    ministryId: number;
    givingFundId: number;
    amount: string;
    purpose: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

type Ministry = {
  id: number;
  name: string;
  verified: boolean;
};

type GivingFund = {
  id: number;
  name: string;
  balance: string;
};

type Donor = {
  id: number;
  firstName: string;
  lastName: string;
  givingFunds: GivingFund[];
};

export function GrantRequestForm({
  onSubmit,
  onCancel,
  loading = false,
}: GrantRequestFormProps) {
  const [formData, setFormData] = useState({
    ministryId: 0,
    donorId: 0,
    givingFundId: 0,
    amount: '',
    purpose: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch ministries and donors
  const { data: ministryData, loading: loadingMinistries } = useQuery(
    LIST_MINISTRIES,
    { variables: { first: 100, filter: { verified: true } } }
  );

  const { data: donorData, loading: loadingDonors } = useQuery(LIST_DONORS);

  // Get ministries and donors from query results
  const ministries: Ministry[] =
    ministryData?.ministries?.edges?.map(
      (edge: { node: Ministry }) => edge.node
    ) || [];
  const donors: Donor[] = donorData?.donors || [];

  // Get giving funds for selected donor
  const selectedDonor = donors.find((d) => d.id === formData.donorId);
  const givingFunds = selectedDonor?.givingFunds || [];

  // Get selected fund balance
  const selectedFund = givingFunds.find((f) => f.id === formData.givingFundId);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Reset giving fund when donor changes
    if (name === 'donorId') {
      setFormData((prev) => ({
        ...prev,
        donorId: parseInt(value),
        givingFundId: 0,
      }));
    } else if (name === 'ministryId' || name === 'givingFundId') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ministryId) {
      newErrors.ministryId = 'Please select a ministry';
    }
    if (!formData.givingFundId) {
      newErrors.givingFundId = 'Please select a giving fund';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please enter the purpose of the grant';
    }

    // Check balance
    if (selectedFund && parseFloat(formData.amount) > parseFloat(selectedFund.balance)) {
      newErrors.amount = 'Amount exceeds available fund balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ministryId: formData.ministryId,
      givingFundId: formData.givingFundId,
      amount: formData.amount,
      purpose: formData.purpose,
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

  const isLoading = loadingMinistries || loadingDonors;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-midnight-900 rounded-xl shadow-2xl w-full max-w-lg border border-black/10 dark:border-white/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            New Grant Request
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create a grant request from a giving fund to a ministry
          </p>
        </div>

        {/* Form */}
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Ministry Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Ministry <span className="text-red-400">*</span>
              </label>
              <select
                name="ministryId"
                value={formData.ministryId}
                onChange={handleChange}
                className={`input-premium w-full ${errors.ministryId ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value={0}>Select a ministry</option>
                {ministries.map((ministry) => (
                  <option key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </option>
                ))}
              </select>
              {errors.ministryId && (
                <p className="mt-1 text-sm text-red-400">{errors.ministryId}</p>
              )}
            </div>

            {/* Donor Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Donor <span className="text-red-400">*</span>
              </label>
              <select
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                className="input-premium w-full"
              >
                <option value={0}>Select a donor</option>
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.firstName} {donor.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Giving Fund Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Giving Fund <span className="text-red-400">*</span>
              </label>
              <select
                name="givingFundId"
                value={formData.givingFundId}
                onChange={handleChange}
                disabled={!formData.donorId}
                className={`input-premium w-full ${errors.givingFundId ? 'border-red-500 focus:ring-red-500' : ''} ${
                  !formData.donorId ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <option value={0}>
                  {formData.donorId ? 'Select a fund' : 'Select a donor first'}
                </option>
                {givingFunds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name} ({formatCurrency(fund.balance)} available)
                  </option>
                ))}
              </select>
              {errors.givingFundId && (
                <p className="mt-1 text-sm text-red-400">{errors.givingFundId}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`input-premium w-full pl-8 ${errors.amount ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
              )}
              {selectedFund && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Available balance: {formatCurrency(selectedFund.balance)}
                </p>
              )}
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Purpose <span className="text-red-400">*</span>
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the purpose of this grant..."
                className={`input-premium w-full ${errors.purpose ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-400">{errors.purpose}</p>
              )}
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-black/10 dark:border-white/10 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading || isLoading}
          >
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
