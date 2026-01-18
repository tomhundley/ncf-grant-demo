/**
 * =============================================================================
 * Demo Layout Component
 * =============================================================================
 *
 * Shared layout for demo pages with navigation header and footer.
 * Used for Dashboard, Ministries, Grants, and Donors pages.
 */

import { NavLink, Outlet, Link } from "react-router-dom";
import { MobileNav } from "../components/MobileNav";
import { ThemeToggle } from "../components/ThemeToggle";

/**
 * Navigation items configuration
 */
const navItems = [
  { path: "/grants-landing", label: "Overview", end: true },
  { path: "/demo", label: "Dashboard", end: true },
  { path: "/ministries", label: "Ministries", end: false },
  { path: "/grants", label: "Grants", end: false },
  { path: "/donors", label: "Donors", end: false },
];

/**
 * Demo Layout Component
 */
export function DemoLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Header */}
      <header
        className="backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300"
        style={{
          backgroundColor: 'var(--color-bg-header)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link
              to="/grants-landing"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg shadow-lg shadow-electric-blue-500/20 overflow-hidden ring-2 ring-electric-blue-500/30">
                <img
                  src="/tom-hundley.jpg"
                  alt="Tom Hundley"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">
                  NCF Grant <span className="text-electric-blue-500 dark:text-electric-blue-400">Demo</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  a demo by{" "}
                  <a
                    href="https://tomhundley.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-blue-500 hover:text-electric-blue-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Tom Hundley
                  </a>
                </p>
              </div>
            </Link>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-electric-blue-600/10 text-electric-blue-600 dark:text-electric-blue-400 border border-electric-blue-600/20 shadow-glow-blue"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle className="hidden md:flex" />

              {/* GitHub Link */}
              <a
                href="https://github.com/tomhundley/ncf-grant-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-2"
                title="View on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-auto hidden md:block transition-colors duration-300"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-glass-bg)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              NCF Grant Management Demo &mdash; Built with React, Apollo Client,
              and GraphQL
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-600">
              By{" "}
              <a
                href="https://tomhundley.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue-500 hover:text-electric-blue-400 transition-colors"
              >
                Tom Hundley
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
