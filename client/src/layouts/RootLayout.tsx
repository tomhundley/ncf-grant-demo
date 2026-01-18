/**
 * =============================================================================
 * Root Layout Component
 * =============================================================================
 *
 * Provides a persistent background across all routes.
 * The video background stays mounted to prevent flashing during navigation.
 */

import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-midnight-950 font-sans text-slate-200 selection:bg-cyber-gold-500 selection:text-midnight-950">
      {/* Persistent Video Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
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
