/**
 * =============================================================================
 * Root Layout Component
 * =============================================================================
 *
 * Provides a persistent background across all routes.
 * Uses different backgrounds based on the current route:
 * - Landing/Story pages: AI robots theme
 * - Demo pages: Community/helping theme (Christian values)
 */

import { Outlet, useLocation } from "react-router-dom";

export function RootLayout() {
  const location = useLocation();

  // Demo pages get the community/helping background
  const isDemoPage = location.pathname.startsWith("/demo") ||
                     location.pathname === "/ministries" ||
                     location.pathname === "/grants" ||
                     location.pathname === "/donors";

  return (
    <div className="min-h-screen bg-midnight-950 font-sans text-slate-200 selection:bg-cyber-gold-500 selection:text-midnight-950">
      {/* Persistent Video Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* AI Robots background for landing/story pages */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isDemoPage ? "opacity-0" : "opacity-20"
          }`}
          poster="/ai-robots-bg.png"
        >
          <source src="/ai-robots-bg.mp4" type="video/mp4" />
        </video>

        {/* Community/helping background for demo pages */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isDemoPage ? "opacity-30" : "opacity-0"
          }`}
        >
          <source src="/ncf-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/90 to-midnight-950/70" />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
