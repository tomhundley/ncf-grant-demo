/**
 * =============================================================================
 * Error Message Component
 * =============================================================================
 *
 * Displays error messages with optional details.
 * Provides consistent error UI across the application.
 */

interface ErrorMessageProps {
  message: string;
  details?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, details, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
          {details && (
            <p className="mt-2 text-sm text-red-700">{details}</p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 btn-secondary text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
