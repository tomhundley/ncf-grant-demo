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
  size?: "sm" | "md" | "lg";
  /** Show label text */
  showLabel?: boolean;
}

/**
 * Theme Toggle Button
 */
export function ThemeToggle({ className = "", size = "md", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // If showLabel is true, render the prominent pill-style button
  if (showLabel) {
    return (
      <button
        onClick={toggleTheme}
        className={`
          flex items-center gap-2 px-4 py-2.5
          bg-white/95 dark:bg-midnight-800/95
          backdrop-blur-md
          border-2 border-cyber-gold-500/60 dark:border-cyber-gold-400/60
          rounded-full
          shadow-lg shadow-black/10 dark:shadow-black/30
          hover:shadow-xl hover:shadow-cyber-gold-500/20
          hover:border-cyber-gold-500 dark:hover:border-cyber-gold-400
          transition-all duration-300
          hover:scale-105
          group
          ${className}
        `}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {/* Icon container */}
        <div className="relative w-6 h-6">
          {/* Sun icon (shown in dark mode) */}
          <svg
            className={`w-6 h-6 text-cyber-gold-500 transition-all duration-300 ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-0 absolute inset-0"
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
          {/* Moon icon (shown in light mode) */}
          <svg
            className={`w-6 h-6 text-slate-600 transition-all duration-300 ${
              theme === "light"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-0 absolute inset-0"
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
        </div>
        {/* Label */}
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-cyber-gold-600 dark:group-hover:text-cyber-gold-400 transition-colors">
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      </button>
    );
  }

  // Default icon-only button
  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
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
        className={`${iconClasses[size]} transition-all duration-300 ${
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
        className={`${iconClasses[size]} transition-all duration-300 ${
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
