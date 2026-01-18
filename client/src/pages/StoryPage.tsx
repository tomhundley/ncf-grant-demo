/**
 * =============================================================================
 * Story Page Component
 * =============================================================================
 *
 * Displays the comic strip narrative explaining why we built this GraphQL API.
 * Features 4 panels that tell the story of manual data management challenges.
 */

import { Link } from 'react-router-dom';

/**
 * Comic panel data
 */
const panels = [
  {
    src: '/comic-strip/panel-1-setup.png',
    alt: 'Panel 1: The Setup - Developer receives a request for grant data',
  },
  {
    src: '/comic-strip/panel-2-checklist.png',
    alt: 'Panel 2: The Checklist - Reviewing the many manual steps required',
  },
  {
    src: '/comic-strip/panel-3-absurdity.png',
    alt: 'Panel 3: The Absurdity - Realizing how complex manual processes have become',
  },
  {
    src: '/comic-strip/panel-4-fixed.png',
    alt: 'Panel 4: The Solution - GraphQL API makes everything simple',
  },
];

/**
 * Story Page Component
 */
export function StoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with back link */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            The Story Behind the API
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comic strip tale of how manual data processes led to the creation
            of this GraphQL API. Follow along to see why we built a better way.
          </p>
        </div>

        {/* Comic panels */}
        <div className="space-y-8">
          {panels.map((panel, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <img
                src={panel.src}
                alt={panel.alt}
                className="w-full h-auto"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Ready to see the solution in action?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="btn-primary inline-flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Try the Demo
            </Link>
            <a
              href="/docs/api/index.html"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              View API Docs
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>Built with React, Apollo Client, and GraphQL</p>
      </footer>
    </div>
  );
}
