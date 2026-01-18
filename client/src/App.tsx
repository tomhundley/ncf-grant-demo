/**
 * =============================================================================
 * Main Application Component
 * =============================================================================
 *
 * Root component that sets up routing and the main layout structure.
 * Includes routes for landing page, story page, and demo pages.
 *
 * @author Tom Hundley
 * @see https://github.com/tomhundley/ncf-grant-demo
 */

import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { StoryPage } from './pages/StoryPage';
import { Dashboard } from './pages/Dashboard';
import { MinistriesPage } from './pages/MinistriesPage';
import { GrantsPage } from './pages/GrantsPage';
import { DonorsPage } from './pages/DonorsPage';
import { DemoLayout } from './layouts/DemoLayout';
import { RootLayout } from './layouts/RootLayout';

/**
 * Main App component
 */
export default function App() {
  return (
    <Routes>
      {/* All routes wrapped in RootLayout for persistent background */}
      <Route element={<RootLayout />}>
        {/* Standalone pages (no nav header) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/story" element={<StoryPage />} />

        {/* Demo pages (with nav header via DemoLayout) */}
        <Route element={<DemoLayout />}>
          <Route path="/demo" element={<Dashboard />} />
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/grants" element={<GrantsPage />} />
          <Route path="/donors" element={<DonorsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
