/**
 * =============================================================================
 * Ministries Page (Premium Edition)
 * =============================================================================
 *
 * Page for viewing and managing ministry organizations.
 * Refactored for the new premium dark aesthetic.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LIST_MINISTRIES, GET_DASHBOARD_STATS } from "../graphql/queries";
import {
  CREATE_MINISTRY,
  UPDATE_MINISTRY,
  DELETE_MINISTRY,
} from "../graphql/mutations";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { MinistryForm } from "../components/MinistryForm";
import { CategoryBadge } from "../components/CategoryBadge";

/**
 * Ministry category options
 */
const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "CHURCH", label: "Church" },
  { value: "MISSIONS", label: "Missions" },
  { value: "EDUCATION", label: "Education" },
  { value: "HUMANITARIAN", label: "Humanitarian" },
  { value: "MEDIA", label: "Media" },
  { value: "YOUTH", label: "Youth" },
  { value: "OTHER", label: "Other" },
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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    variables: {
      first: 10,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    },
  });

  // Create ministry mutation
  const [createMinistry, { loading: creating }] = useMutation(CREATE_MINISTRY, {
    refetchQueries: [
      { query: LIST_MINISTRIES },
      { query: GET_DASHBOARD_STATS },
    ],
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
    refetchQueries: [
      { query: LIST_MINISTRIES },
      { query: GET_DASHBOARD_STATS },
    ],
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
    if (confirm("Are you sure you want to delete this ministry?")) {
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-1">
            Ministries
          </h1>
          <p className="text-slate-400 text-sm">
            Manage ministry organizations eligible for grants.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMinistry(null);
            setIsFormOpen(true);
          }}
          className="btn-primary py-2 px-4 shadow-lg shadow-electric-blue-600/20"
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Add Ministry
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search ministries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium bg-midnight-800 border-white/10 text-slate-200 w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-premium bg-midnight-800 border-white/10 text-slate-200 w-auto"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Verified Filter */}
          <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-midnight-800 text-electric-blue-500 focus:ring-electric-blue-500 focus:ring-offset-midnight-950"
            />
            <span className="text-sm font-medium">Verified only</span>
          </label>
        </div>
      </div>

      {/* Ministries List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage
          message="Failed to load ministries"
          details={error.message}
        />
      ) : (
        <>
          <div className="glass-panel overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-midnight-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Ministry
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Total Funded
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
                  {data?.ministries?.edges?.map(
                    ({ node: ministry }: { node: Ministry }) => (
                      <tr
                        key={ministry.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-bold text-white">
                              {ministry.name}
                            </div>
                            {ministry.ein && (
                              <div className="text-xs text-slate-500 mt-1 font-mono">
                                EIN: {ministry.ein}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <CategoryBadge category={ministry.category} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {ministry.city && ministry.state ? (
                            `${ministry.city}, ${ministry.state}`
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-cyber-gold-400 font-serif">
                          {formatCurrency(ministry.totalFunded)}
                        </td>
                        <td className="px-6 py-4">
                          {ministry.verified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neon-green-500/20 text-neon-green-400 border border-neon-green-500/30">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyber-gold-500/20 text-cyber-gold-400 border border-cyber-gold-500/30">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <button
                            onClick={() => handleEdit(ministry)}
                            className="text-electric-blue-400 hover:text-electric-blue-300 mr-4 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ministry.id)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Load More Button */}
          {data?.ministries?.pageInfo?.hasNextPage && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                className="btn-outline border-white/20 text-slate-300 hover:text-white hover:border-white/40"
              >
                Load More Ministries
              </button>
            </div>
          )}
        </>
      )}

      {/* Ministry Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-2xl bg-midnight-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-midnight-800/50">
              <h2 className="text-xl font-bold text-white">
                {editingMinistry ? "Edit Ministry" : "Add New Ministry"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <MinistryForm
                ministry={editingMinistry}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingMinistry(null);
                }}
                loading={creating || updating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
