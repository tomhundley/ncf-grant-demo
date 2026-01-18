/**
 * =============================================================================
 * Root Layout Component
 * =============================================================================
 *
 * Provides a persistent background across all routes.
 * Uses different backgrounds based on the current route:
 * - Tech Landing/Story pages: AI robots video theme
 * - Grant Landing page: Helping hands video theme
 * - Admin pages: Static teal watercolor background
 *
 * Supports both light and dark themes with appropriate overlays.
 */

import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export function RootLayout() {
  const location = useLocation();
  const { theme } = useTheme();

  // Grant landing page gets the helping hands video
  const isGrantLanding = location.pathname === "/grants-landing";

  // Admin pages get the static background
  const isAdminPage = location.pathname.startsWith("/demo") ||
                      location.pathname === "/ministries" ||
                      location.pathname === "/grants" ||
                      location.pathname === "/donors";

  // Tech landing pages (default) get the AI robots video
  const isTechLanding = !isGrantLanding && !isAdminPage;

  const isDark = theme === "dark";

  return (
    <div
      className="min-h-screen font-sans selection:bg-cyber-gold-500 selection:text-midnight-950 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-secondary)'
      }}
    >
      {/* Persistent Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* AI Robots video for tech landing/story pages */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isTechLanding ? (isDark ? "opacity-50" : "opacity-50") : "opacity-0"
          }`}
          poster="/ai-robots-bg.png"
        >
          <source src="/ai-robots-bg.mp4" type="video/mp4" />
        </video>

        {/* Helping hands video for grant landing page ONLY */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isGrantLanding ? (isDark ? "opacity-50" : "opacity-50") : "opacity-0"
          }`}
        >
          <source src="/ncf-bg.mp4" type="video/mp4" />
        </video>

        {/* Static background for admin pages */}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
            isAdminPage ? (isDark ? "opacity-40" : "opacity-40") : "opacity-0"
          }`}
          style={{ backgroundImage: "url('/admin-bg.png')" }}
        />

        {/* Gradient overlay - different for light/dark */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? "bg-gradient-to-t from-midnight-950/80 via-midnight-950/50 to-transparent"
              : "bg-gradient-to-t from-slate-50/70 via-slate-50/40 to-transparent"
          }`}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
