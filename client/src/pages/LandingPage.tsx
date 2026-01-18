/**
 * =============================================================================
 * Landing Page Component
 * =============================================================================
 *
 * Landing page for the NCF Grant Management Demo.
 * Demonstrates AI-assisted development capabilities.
 */

import { Link } from "react-router-dom";
import { MobileNav } from "../components/MobileNav";

/**
 * Get the Apollo Sandbox URL based on environment
 */
const getApolloSandboxUrl = () => {
  const graphqlEndpoint = import.meta.env.PROD
    ? "https://ncf-demo.thomashundley.com/api/graphql"
    : "http://localhost:4000";
  return `https://studio.apollographql.com/sandbox/explorer?endpoint=${encodeURIComponent(graphqlEndpoint)}`;
};

/**
 * Street Sign Arrow Component
 */
/**
 * Tailwind class safelist (ensures these classes aren't purged):
 * from-purple-600 to-purple-500 from-purple-500 to-purple-400
 * text-purple-600 group-hover:text-purple-500
 * from-neon-green-600 to-neon-green-500 from-neon-green-500 to-neon-green-400
 * text-neon-green-600 group-hover:text-neon-green-500
 */
function SignArrow({
  direction,
  label,
  href,
  external,
  color = "white",
  animated = false,
}: {
  direction: "left" | "right";
  label: string;
  href: string;
  external?: boolean;
  color?: "gold" | "blue" | "green" | "white" | "purple";
  animated?: boolean;
}) {
  // Inline style colors for signs (hex values)
  const signColors = {
    gold: { from: "#d97706", to: "#f59e0b" },
    blue: { from: "#2563eb", to: "#3b82f6" },
    green: { from: "#16a34a", to: "#22c55e" },
    white: { from: "#475569", to: "#64748b" },
    purple: { from: "#9333ea", to: "#a855f7" },
  };

  const arrowHexColors = {
    gold: "#d97706",
    blue: "#2563eb",
    green: "#16a34a",
    white: "#475569",
    purple: "#9333ea",
  };

  const glowColors = {
    gold: "rgba(251, 191, 36, 1)",
    blue: "rgba(96, 165, 250, 1)",
    green: "rgba(34, 197, 94, 1)",
    white: "rgba(148, 163, 184, 1)",
    purple: "rgba(168, 85, 247, 1)",
  };

  const arrow = (
    <div
      className={`
        relative flex items-center cursor-pointer transition-all duration-300 hover:scale-105 group
        ${direction === "left" ? "flex-row" : "flex-row-reverse"}
      `}
    >
      {/* Animated border flare */}
      {animated && (
        <>
          {/* Outer glow pulse */}
          <div
            className="absolute -inset-2 rounded-xl opacity-60"
            style={{
              marginLeft: direction === "right" ? "16px" : "0",
              marginRight: direction === "left" ? "16px" : "0",
              background: `conic-gradient(from var(--angle, 0deg), transparent 30%, ${glowColors[color]} 50%, transparent 70%)`,
              animation: "borderSpin 2s linear infinite",
              filter: "blur(8px)",
            }}
          />
          {/* Sharp spinning border */}
          <div
            className="absolute -inset-[3px] rounded-lg"
            style={{
              marginLeft: direction === "right" ? "17px" : "0",
              marginRight: direction === "left" ? "17px" : "0",
              padding: "3px",
              background: `conic-gradient(from var(--angle, 0deg), transparent 20%, ${signColors[color].from} 35%, ${glowColors[color]} 50%, ${signColors[color].to} 65%, transparent 80%)`,
              animation: "borderSpin 2s linear infinite",
            }}
          >
            <div
              className="w-full h-full rounded-md"
              style={{
                background: `linear-gradient(to right, ${signColors[color].from}, ${signColors[color].to})`,
              }}
            />
          </div>
        </>
      )}

      {/* Arrow Point */}
      <div
        className={`
          w-0 h-0 transition-colors relative z-10
          ${direction === "left"
            ? "border-r-[20px] border-y-[22px] border-y-transparent"
            : "border-l-[20px] border-y-[22px] border-y-transparent"
          }
        `}
        style={{
          [direction === "left" ? "borderRightColor" : "borderLeftColor"]: arrowHexColors[color],
          filter: animated ? `drop-shadow(0 0 8px ${glowColors[color]})` : undefined,
        }}
      />
      {/* Sign Body */}
      <div
        className={`
          px-6 py-3 relative z-10
          font-bold text-white text-lg tracking-wide uppercase
          shadow-lg
          transition-all duration-300
          ${direction === "left" ? "rounded-r-md" : "rounded-l-md"}
        `}
        style={{
          background: `linear-gradient(to right, ${signColors[color].from}, ${signColors[color].to})`,
          boxShadow: animated ? `0 0 20px ${glowColors[color]}, 0 0 40px ${glowColors[color].replace('0.8', '0.3').replace('0.6', '0.2')}` : undefined,
        }}
      >
        {label}
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {arrow}
      </a>
    );
  }

  return <Link to={href}>{arrow}</Link>;
}

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Tailwind safelist - hidden element to prevent class purging */}
      <div className="hidden from-purple-600 to-purple-500 from-purple-500 to-purple-400 text-purple-600 group-hover:text-purple-500 from-neon-green-600 to-neon-green-500 from-neon-green-500 to-neon-green-400 text-neon-green-600 group-hover:text-neon-green-500" />

      {/* Main Content */}
      <div className="relative flex flex-col min-h-screen">
        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-24 md:pb-0 text-center">
          {/* Demo Badge */}
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-cyber-gold-500/20 border border-cyber-gold-500/40 rounded-full text-cyber-gold-400 text-sm font-medium uppercase tracking-wider">
              Technical Demo
            </span>
          </div>

          {/* Main Headline - NCF Grant Management */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-4 leading-tight text-white animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-cyber-gold-400">NCF</span> Grant Management
          </h1>

          <p
            className="text-xl md:text-2xl text-slate-300 font-light mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            A full-stack application demo for{" "}
            <span className="text-white font-medium">National Christian Foundation</span>
          </p>

          {/* Tech Stack Pills */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {["GraphQL", "React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-300 text-sm font-mono"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* AI Orchestration Subheading */}
          <div
            className="mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <p className="text-slate-500 text-sm uppercase tracking-widest mb-2">Built with</p>
            <p className="text-2xl md:text-3xl font-serif text-white">
              AI <span className="text-cyber-gold-400">Orchestration</span>
            </p>
            <p className="max-w-xl mx-auto text-slate-400 text-sm mt-3">
              As an AI orchestrator, I don't need to know GraphQL to build with it.
              <br />
              <span className="text-slate-300">Here's a working demo and source code to illustrate the point.</span>
            </p>
          </div>

          {/* Street Sign Post */}
          <div
            className="relative flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* The Post */}
            <div className="absolute top-0 bottom-0 w-4 bg-gradient-to-b from-slate-600 to-slate-700 rounded-full shadow-xl z-0" />

            {/* Signs Container */}
            <div className="relative z-10 flex flex-col gap-4 py-8">
              {/* Left-pointing signs */}
              <div className="flex justify-end pr-2">
                <SignArrow
                  direction="left"
                  label="The Story"
                  href="/story"
                  color="gold"
                />
              </div>

              <div className="flex justify-end pr-2">
                <SignArrow
                  direction="left"
                  label="Tech Stack"
                  href="/tech"
                  color="purple"
                />
              </div>

              <div className="flex justify-start pl-2">
                <SignArrow
                  direction="right"
                  label="SpectaQL"
                  href="/docs/api/index.html"
                  external
                  color="white"
                />
              </div>

              {/* Right-pointing signs */}
              <div className="flex justify-start pl-2">
                <SignArrow
                  direction="right"
                  label="Live Demo"
                  href="/demo"
                  color="blue"
                  animated
                />
              </div>

              <div className="flex justify-start pl-2">
                <SignArrow
                  direction="right"
                  label="Sandbox"
                  href={getApolloSandboxUrl()}
                  external
                  color="green"
                />
              </div>

              <div className="flex justify-end pr-2">
                <SignArrow
                  direction="left"
                  label="GitHub"
                  href="https://github.com/tomhundley/ncf-grant-demo"
                  external
                  color="white"
                />
              </div>
            </div>

            {/* Post Base */}
            <div className="w-20 h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-full shadow-lg mt-4" />
          </div>

        </main>
      </div>

      <MobileNav />
    </div>
  );
}
