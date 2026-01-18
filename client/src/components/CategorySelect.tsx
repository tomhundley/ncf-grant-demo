/**
 * =============================================================================
 * Category Select Component
 * =============================================================================
 *
 * A beautiful, accessible dropdown for selecting ministry categories.
 * Features category icons and smooth animations for both light/dark themes.
 */

import { useState, useRef, useEffect } from "react";

type Category = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const CATEGORIES: Category[] = [
  {
    value: "",
    label: "All Categories",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    value: "CHURCH",
    label: "Church",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    value: "MISSIONS",
    label: "Missions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: "EDUCATION",
    label: "Education",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  },
  {
    value: "HUMANITARIAN",
    label: "Humanitarian",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    value: "MEDIA",
    label: "Media",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: "YOUTH",
    label: "Youth",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    value: "OTHER",
    label: "Other",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
  },
];

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CategorySelect({ value, onChange, className = "" }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected category
  const selectedCategory = CATEGORIES.find((cat) => cat.value === value) || CATEGORIES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-xl w-full
          bg-white dark:bg-midnight-800
          border border-slate-200 dark:border-white/10
          hover:border-electric-blue-500/50 dark:hover:border-electric-blue-500/50
          focus:outline-none focus:ring-2 focus:ring-electric-blue-500/20 focus:border-electric-blue-500
          transition-all duration-200
          text-left
          ${isOpen ? "border-electric-blue-500 ring-2 ring-electric-blue-500/20" : ""}
        `}
      >
        {/* Selected Icon */}
        <span className="text-electric-blue-500 dark:text-electric-blue-400 flex-shrink-0">
          {selectedCategory.icon}
        </span>

        {/* Selected Label */}
        <span className="flex-1 text-slate-900 dark:text-white font-medium truncate">
          {selectedCategory.label}
        </span>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute z-[100] mt-2 w-full min-w-[220px]
            bg-white dark:bg-midnight-900
            border border-slate-200 dark:border-white/10
            rounded-xl shadow-xl dark:shadow-2xl dark:shadow-black/50
            overflow-hidden
            animate-fade-in-up
          "
          style={{ animationDuration: "150ms" }}
        >
          <div className="py-1 max-h-80 overflow-y-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => {
                  onChange(category.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left
                  transition-all duration-150
                  ${
                    value === category.value
                      ? "bg-electric-blue-500/10 text-electric-blue-600 dark:text-electric-blue-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  }
                `}
              >
                {/* Category Icon */}
                <span
                  className={`flex-shrink-0 ${
                    value === category.value
                      ? "text-electric-blue-500 dark:text-electric-blue-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {category.icon}
                </span>

                {/* Category Label */}
                <span className="font-medium">{category.label}</span>

                {/* Checkmark for selected */}
                {value === category.value && (
                  <svg
                    className="w-5 h-5 ml-auto text-electric-blue-500 dark:text-electric-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export CATEGORIES for use in other components (like MinistryForm)
export { CATEGORIES };
