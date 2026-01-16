/**
 * =============================================================================
 * Category Badge Component
 * =============================================================================
 *
 * Displays a colored badge for ministry categories.
 * Each category has a distinct color for easy identification.
 */

interface CategoryBadgeProps {
  category: string;
}

const categoryConfig: Record<string, { bg: string; text: string; label: string }> = {
  CHURCH: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Church' },
  MISSIONS: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Missions' },
  EDUCATION: { bg: 'bg-green-100', text: 'text-green-800', label: 'Education' },
  HUMANITARIAN: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Humanitarian' },
  MEDIA: { bg: 'bg-pink-100', text: 'text-pink-800', label: 'Media' },
  YOUTH: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Youth' },
  OTHER: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Other' },
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: category,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
