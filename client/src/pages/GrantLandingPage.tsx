/**
 * =============================================================================
 * Grant Landing Page Component
 * =============================================================================
 *
 * Dedicated landing page for the Grant Management System.
 * Explains the system capabilities and provides entry points to the admin dashboard.
 */

import { Link } from "react-router-dom";
import { MobileNav } from "../components/MobileNav";
import { ThemeToggle } from "../components/ThemeToggle";

/**
 * Feature Card Component
 */
function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="glass-panel p-6 hover:border-cyber-gold-500/40 transition-all duration-300 group hover:scale-[1.02]"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-cyber-gold-500/20 text-cyber-gold-500 dark:text-cyber-gold-400 group-hover:bg-cyber-gold-500/30 transition-colors">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyber-gold-500 dark:group-hover:text-cyber-gold-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Step Component for "How It Works" section
 */
function StepItem({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-electric-blue-500/20 border border-electric-blue-500/40 flex items-center justify-center mb-4">
        <span className="text-xl font-bold text-electric-blue-600 dark:text-electric-blue-400">{number}</span>
      </div>
      <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
    </div>
  );
}

/**
 * Grant Landing Page
 */
export function GrantLandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Theme Toggle - Prominent fixed position top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle showLabel />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 md:py-24 text-center">
          {/* Demo Badge */}
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-cyber-gold-500/20 border border-cyber-gold-500/40 rounded-full text-cyber-gold-400 text-sm font-medium uppercase tracking-wider">
              Grant Management System
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white animate-fade-in-up max-w-4xl"
            style={{ animationDelay: "0.1s" }}
          >
            Empowering <span className="text-cyber-gold-500 dark:text-cyber-gold-400">Generosity</span>{" "}
            Through Thoughtful Giving
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-light mb-10 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            The NCF Grant Management System streamlines the process of connecting
            generous donors with ministries making a difference. Track requests,
            manage funds, and measure impact—all in one place.
          </p>

          {/* Dual CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              to="/grants"
              className="px-8 py-3 bg-gradient-to-r from-cyber-gold-500 to-cyber-gold-600 hover:from-cyber-gold-600 hover:to-cyber-gold-700 text-midnight-950 font-bold rounded-lg shadow-lg hover:shadow-cyber-gold-500/25 transition-all duration-300 hover:scale-105"
            >
              Submit Grant Request
            </Link>
            <Link
              to="/demo"
              className="px-8 py-3 bg-electric-blue-500/20 border border-electric-blue-500/40 hover:bg-electric-blue-500/30 text-electric-blue-300 font-bold rounded-lg transition-all duration-300 hover:scale-105"
            >
              Admin Dashboard
            </Link>
          </div>

          {/* Back to Tech Demo Link */}
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            ← Back to Tech Demo
          </Link>
        </section>

        {/* Features Grid */}
        <section className="px-4 sm:px-6 py-16 max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              Complete Grant Management
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage the entire grant lifecycle, from request
              submission to impact reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              href="/ministries"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              title="Manage Ministries"
              description="Track verified ministry organizations, their missions, and giving history. Ensure grants reach legitimate organizations doing meaningful work."
            />

            <FeatureCard
              href="/donors"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Manage Donors"
              description="Coordinate giving funds and donor relationships. Track fund balances, contribution history, and giving preferences."
            />

            <FeatureCard
              href="/grants"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Process Grant Requests"
              description="Streamlined approval workflow for grant requests. Review, approve, or decline requests with full audit trail and status tracking."
            />

            <FeatureCard
              href="/demo"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Track Impact"
              description="Real-time dashboards and reporting. Monitor grant distribution, fund utilization, and ministry outcomes all in one place."
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 sm:px-6 py-16 max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              A simple, transparent process from request to disbursement.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StepItem
              number={1}
              title="Request"
              description="Ministry submits a grant request with purpose and amount"
            />
            <StepItem
              number={2}
              title="Review"
              description="NCF team reviews the request against fund guidelines"
            />
            <StepItem
              number={3}
              title="Approve"
              description="Donor or advisor approves the grant recommendation"
            />
            <StepItem
              number={4}
              title="Disburse"
              description="Funds are transferred to the ministry"
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 py-16 pb-32 md:pb-16">
          <div className="max-w-2xl mx-auto text-center glass-panel p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Explore the admin dashboard to see the full capabilities of the
              grant management system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/demo"
                className="px-8 py-3 bg-gradient-to-r from-electric-blue-500 to-electric-blue-600 hover:from-electric-blue-600 hover:to-electric-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-electric-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                View Dashboard
              </Link>
              <Link
                to="/ministries"
                className="px-8 py-3 bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 hover:bg-black/20 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
              >
                Browse Ministries
              </Link>
            </div>
          </div>
        </section>
      </div>

      <MobileNav />
    </div>
  );
}
