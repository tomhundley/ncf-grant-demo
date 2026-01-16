/**
 * =============================================================================
 * Ministry Form Component
 * =============================================================================
 *
 * Form for creating and editing ministry records.
 * Demonstrates:
 *   - Controlled form inputs
 *   - Form validation
 *   - Handling both create and edit modes
 */

import { useState, useEffect } from 'react';

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
} | null;

interface MinistryFormProps {
  ministry?: Ministry;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CATEGORIES = [
  { value: 'CHURCH', label: 'Church' },
  { value: 'MISSIONS', label: 'Missions' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'HUMANITARIAN', label: 'Humanitarian' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'YOUTH', label: 'Youth' },
  { value: 'OTHER', label: 'Other' },
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function MinistryForm({
  ministry,
  onSubmit,
  onCancel,
  loading = false,
}: MinistryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    ein: '',
    category: 'CHURCH',
    description: '',
    mission: '',
    website: '',
    city: '',
    state: '',
    verified: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (ministry) {
      setFormData({
        name: ministry.name || '',
        ein: ministry.ein || '',
        category: ministry.category || 'CHURCH',
        description: ministry.description || '',
        mission: ministry.mission || '',
        website: ministry.website || '',
        city: ministry.city || '',
        state: ministry.state || '',
        verified: ministry.verified || false,
      });
    }
  }, [ministry]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Ministry name is required';
    }
    if (formData.ein && !/^\d{2}-\d{7}$/.test(formData.ein)) {
      newErrors.ein = 'EIN must be in format XX-XXXXXXX';
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Clean up empty strings to null for optional fields
    const cleanData = {
      ...formData,
      ein: formData.ein || null,
      description: formData.description || null,
      mission: formData.mission || null,
      website: formData.website || null,
      city: formData.city || null,
      state: formData.state || null,
    };

    await onSubmit(cleanData);
  };

  const isEditing = !!ministry;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Ministry' : 'Add New Ministry'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label">
              Ministry Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter ministry name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* EIN and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">EIN</label>
              <input
                type="text"
                name="ein"
                value={formData.ein}
                onChange={handleChange}
                className={`input ${errors.ein ? 'border-red-500' : ''}`}
                placeholder="XX-XXXXXXX"
              />
              {errors.ein && (
                <p className="mt-1 text-sm text-red-500">{errors.ein}</p>
              )}
            </div>
            <div>
              <label className="label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input"
              placeholder="Brief description of the ministry"
            />
          </div>

          {/* Mission */}
          <div>
            <label className="label">Mission Statement</label>
            <textarea
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              rows={2}
              className="input"
              placeholder="Ministry's mission statement"
            />
          </div>

          {/* Website */}
          <div>
            <label className="label">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`input ${errors.website ? 'border-red-500' : ''}`}
              placeholder="https://example.org"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-500">{errors.website}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input"
                placeholder="City"
              />
            </div>
            <div>
              <label className="label">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select State</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="verified"
              id="verified"
              checked={formData.verified}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
              Mark as verified (EIN has been validated)
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : isEditing
              ? 'Update Ministry'
              : 'Create Ministry'}
          </button>
        </div>
      </div>
    </div>
  );
}
