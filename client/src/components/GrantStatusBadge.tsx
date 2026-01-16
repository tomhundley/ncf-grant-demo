/**
 * =============================================================================
 * Grant Status Badge Component
 * =============================================================================
 *
 * Displays a colored badge for grant status.
 * Uses consistent color coding across the application.
 */

interface GrantStatusBadgeProps {
  status: 'PENDING' | 'APPROVED' | 'FUNDED' | 'REJECTED' | string;
}

const statusConfig: Record<string, { className: string; label: string }> = {
  PENDING: { className: 'badge-pending', label: 'Pending' },
  APPROVED: { className: 'badge-approved', label: 'Approved' },
  FUNDED: { className: 'badge-funded', label: 'Funded' },
  REJECTED: { className: 'badge-rejected', label: 'Rejected' },
};

export function GrantStatusBadge({ status }: GrantStatusBadgeProps) {
  const config = statusConfig[status] || {
    className: 'badge bg-gray-100 text-gray-800',
    label: status,
  };

  return <span className={config.className}>{config.label}</span>;
}
