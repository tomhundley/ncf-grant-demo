/**
 * =============================================================================
 * Story Page Component
 * =============================================================================
 *
 * Displays the comic strip narrative with a sleek, immersive dark mode design.
 * Features 4 panels showing what's possible when you dive in and learn.
 * Built to demonstrate: no prior GraphQL experience required.
 */

import { Link } from "react-router-dom";
import { MobileNav } from "../components/MobileNav";
import { useEffect } from "react";

/**
 * Comic panel data
 */
const panels = [
  {
    src: "/comic-strip/panel-1-setup.png",
    alt: "The Setup: A manual request comes in.",
  },
  {
    src: "/comic-strip/panel-2-checklist.png",
    alt: "The Checklist: The overwhelming manual process.",
  },
  {
    src: "/comic-strip/panel-3-absurdity.png",
    alt: "The Absurdity: Why are we doing this?",
  },
  {
    src: "/comic-strip/panel-4-fixed.png",
    alt: "The Solution: GraphQL automation.",
  },
];

export function StoryPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white font-sans">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-midnight-950/80 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center text-electric-blue-600 dark:text-electric-blue-300 hover:text-electric-blue-800 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium tracking-wide text-sm uppercase">
              Return Home
            </span>
          </Link>
          <div className="hidden sm:block text-cyber-gold-400 font-serif italic text-lg tracking-wider">
            The Story
          </div>
          <Link
            to="/demo"
            className="text-sm font-bold text-neon-green-400 hover:text-neon-green-300 transition-colors uppercase tracking-wider"
          >
            Skip to Demo →
          </Link>
        </div>
      </header>

      {/* Hero Title */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-electric-blue-700 to-electric-blue-500 dark:from-white dark:via-electric-blue-100 dark:to-electric-blue-300 animate-fade-in-up">
          The Story
        </h1>
        <p
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          How AI orchestration transforms the way we build software.
          <br />
          <span className="text-slate-900 dark:text-white font-medium">A comic strip about the problem this demo solves.</span>
        </p>
      </section>

      {/* Comic Stream */}
      <main className="max-w-5xl mx-auto px-4 pb-32 space-y-32">
        {panels.map((panel, index) => (
          <article
            key={index}
            className="flex flex-col items-center animate-fade-in-up"
            style={{
              animationDelay: `${index * 200}ms`,
              animationFillMode: "forwards",
            }}
          >
            <div className="relative group w-full max-w-4xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue-600 to-neon-green-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

              <div className="relative bg-white dark:bg-midnight-900 rounded-xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10">
                <img
                  src={panel.src}
                  alt={panel.alt}
                  className="w-full h-auto transform transition-transform duration-700 group-hover:scale-[1.01]"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          </article>
        ))}

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-midnight-900 dark:to-midnight-800 rounded-3xl p-8 md:p-16 text-center border border-black/10 dark:border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyber-gold-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-neon-green-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

          <h2 className="relative text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            See It In Action
          </h2>
          <p className="relative text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            A fully functional grant management system, built with AI orchestration.
          </p>

          <div className="relative flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="btn-primary text-lg px-10 py-4 bg-neon-green-600 hover:bg-neon-green-500 shadow-neon-green-600/30 text-white border-0"
            >
              Back to Home
            </Link>
            <a
              href="/docs/api/index.html"
              className="btn-outline border-black/20 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-midnight-900"
            >
              Explore the API Schema
            </a>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
