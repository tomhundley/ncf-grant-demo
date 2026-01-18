/**
 * =============================================================================
 * Theme Toggle Component
 * =============================================================================
 *
 * A button that toggles between light and dark themes.
 * Shows sun icon for dark mode, moon icon for light mode.
 */

import { useTheme } from "../contexts/ThemeContext";

interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: "sm" | "md";
}

/**
 * Theme Toggle Button
 */
export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses}
        flex items-center justify-center
        rounded-lg
        transition-all duration-300
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-electric-blue-500/50
        bg-transparent hover:bg-white/10 dark:hover:bg-white/10
        text-slate-600 dark:text-slate-400
        hover:text-electric-blue-500 dark:hover:text-electric-blue-400
        ${className}
      `}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun icon (shown in dark mode - click to go light) */}
      <svg
        className={`${iconClasses} transition-all duration-300 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0 absolute"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon icon (shown in light mode - click to go dark) */}
      <svg
        className={`${iconClasses} transition-all duration-300 ${
          theme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0 absolute"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
