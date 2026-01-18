/**
 * =============================================================================
 * Ministry Form Component
 * =============================================================================
 *
 * Form for creating and editing ministry records.
 * Styled for the premium dark theme.
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

  const inputClasses = "w-full px-4 py-2.5 bg-slate-50 dark:bg-midnight-800 border border-black/10 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-electric-blue-500 focus:ring-2 focus:ring-electric-blue-500/20 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className={labelClasses}>
          Ministry Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${inputClasses} ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="Enter ministry name"
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      {/* EIN and Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>EIN</label>
          <input
            type="text"
            name="ein"
            value={formData.ein}
            onChange={handleChange}
            className={`${inputClasses} ${errors.ein ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="XX-XXXXXXX"
          />
          {errors.ein && (
            <p className="mt-1.5 text-sm text-red-400">{errors.ein}</p>
          )}
        </div>
        <div>
          <label className={labelClasses}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClasses}
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
        <label className={labelClasses}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={inputClasses}
          placeholder="Brief description of the ministry"
        />
      </div>

      {/* Mission */}
      <div>
        <label className={labelClasses}>Mission Statement</label>
        <textarea
          name="mission"
          value={formData.mission}
          onChange={handleChange}
          rows={2}
          className={inputClasses}
          placeholder="Ministry's mission statement"
        />
      </div>

      {/* Website */}
      <div>
        <label className={labelClasses}>Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`${inputClasses} ${errors.website ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder="https://example.org"
        />
        {errors.website && (
          <p className="mt-1.5 text-sm text-red-400">{errors.website}</p>
        )}
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClasses}
            placeholder="City"
          />
        </div>
        <div>
          <label className={labelClasses}>State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={inputClasses}
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
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-midnight-800 text-electric-blue-500 focus:ring-electric-blue-500 focus:ring-offset-white dark:focus:ring-offset-midnight-950"
        />
        <label htmlFor="verified" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
          Mark as verified (EIN has been validated)
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-black/10 dark:border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline px-5 py-2.5"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary px-5 py-2.5"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : isEditing
            ? 'Update Ministry'
            : 'Create Ministry'}
        </button>
      </div>
    </form>
  );
}
