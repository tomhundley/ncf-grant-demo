/**
 * =============================================================================
 * Ministries Page
 * =============================================================================
 *
 * Page for viewing and managing ministry organizations.
 * Demonstrates:
 *   - Cursor-based pagination with Apollo Client
 *   - Filter/search functionality
 *   - Create/Update mutations with cache updates
 *   - Optimistic UI updates
 *
 * @see https://www.apollographql.com/docs/react/pagination/cursor-based/
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { LIST_MINISTRIES, GET_DASHBOARD_STATS } from '../graphql/queries';
import { CREATE_MINISTRY, UPDATE_MINISTRY, DELETE_MINISTRY } from '../graphql/mutations';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { MinistryForm } from '../components/MinistryForm';
import { CategoryBadge } from '../components/CategoryBadge';

/**
 * Ministry category options
 */
const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'CHURCH', label: 'Church' },
  { value: 'MISSIONS', label: 'Missions' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'HUMANITARIAN', label: 'Humanitarian' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'YOUTH', label: 'Youth' },
  { value: 'OTHER', label: 'Other' },
];

type Ministry = {
  id: number;
  name: string;
  ein: string | null;
  category: string;
  description: string | null;
  mission: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  verified: boolean;
  totalFunded: string;
};

/**
 * Ministries Page Component
 */
export function MinistriesPage() {
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  // Build filter object for query
  const filter = {
    ...(categoryFilter && { category: categoryFilter }),
    ...(verifiedOnly && { verified: true }),
    ...(searchTerm && { search: searchTerm }),
  };

  // Fetch ministries with pagination
  const { data, loading, error, fetchMore } = useQuery(LIST_MINISTRIES, {
    variables: { first: 10, filter: Object.keys(filter).length > 0 ? filter : undefined },
  });

  // Create ministry mutation
  const [createMinistry, { loading: creating }] = useMutation(CREATE_MINISTRY, {
    refetchQueries: [{ query: LIST_MINISTRIES }, { query: GET_DASHBOARD_STATS }],
    onCompleted: () => setIsFormOpen(false),
  });

  // Update ministry mutation
  const [updateMinistry, { loading: updating }] = useMutation(UPDATE_MINISTRY, {
    onCompleted: () => {
      setIsFormOpen(false);
      setEditingMinistry(null);
    },
  });

  // Delete ministry mutation
  const [deleteMinistry] = useMutation(DELETE_MINISTRY, {
    refetchQueries: [{ query: LIST_MINISTRIES }, { query: GET_DASHBOARD_STATS }],
  });

  // Handle form submission
  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (editingMinistry) {
      await updateMinistry({
        variables: { id: editingMinistry.id, input: formData },
      });
    } else {
      await createMinistry({
        variables: { input: formData },
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this ministry?')) {
      await deleteMinistry({ variables: { id } });
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (data?.ministries?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: data.ministries.pageInfo.endCursor,
        },
      });
    }
  };

  // Handle edit
  const handleEdit = (ministry: Ministry) => {
    setEditingMinistry(ministry);
    setIsFormOpen(true);
  };

  // Format currency
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ministries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage ministry organizations eligible for grants
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMinistry(null);
            setIsFormOpen(true);
          }}
          className="btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Ministry
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search ministries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input w-auto"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Verified Filter */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Verified only</span>
          </label>
        </div>
      </div>

      {/* Ministries List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message="Failed to load ministries" details={error.message} />
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ministry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Funded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.ministries?.edges?.map(({ node: ministry }: { node: Ministry }) => (
                  <tr key={ministry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{ministry.name}</div>
                        {ministry.ein && (
                          <div className="text-sm text-gray-500">EIN: {ministry.ein}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <CategoryBadge category={ministry.category} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {ministry.city && ministry.state
                        ? `${ministry.city}, ${ministry.state}`
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(ministry.totalFunded)}
                    </td>
                    <td className="px-6 py-4">
                      {ministry.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => handleEdit(ministry)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ministry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          {data?.ministries?.pageInfo?.hasNextPage && (
            <div className="flex justify-center">
              <button onClick={handleLoadMore} className="btn-secondary">
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* Ministry Form Modal */}
      {isFormOpen && (
        <MinistryForm
          ministry={editingMinistry}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingMinistry(null);
          }}
          loading={creating || updating}
        />
      )}
    </div>
  );
}
