/**
 * =============================================================================
 * Landing Page Component
 * =============================================================================
 *
 * Main entry point with 4 pathway cards for navigating the demo.
 * Provides access to Story, API Documentation, Demo, and GitHub.
 */

import { Link } from 'react-router-dom';

/**
 * Get the Apollo Sandbox URL based on environment
 */
const getApolloSandboxUrl = () => {
  const graphqlEndpoint = import.meta.env.PROD
    ? 'https://ncf-demo.thomashundley.com/api/graphql'
    : 'http://localhost:4000';
  return `https://studio.apollographql.com/sandbox/explorer?endpoint=${encodeURIComponent(graphqlEndpoint)}`;
};

/**
 * Pathway card data
 */
const pathways = [
  {
    title: 'Story',
    description: 'Learn why we built this GraphQL API through our comic strip narrative',
    to: '/story',
    external: false,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: 'API Documentation',
    description: 'Explore the GraphQL schema with SpectaQL docs and Apollo Sandbox',
    to: '/docs/api/index.html',
    secondaryLink: {
      label: 'Apollo Sandbox',
      getUrl: getApolloSandboxUrl,
    },
    external: false,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: 'Demo',
    description: 'Try the interactive grant management dashboard powered by GraphQL',
    to: '/demo',
    external: false,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: 'GitHub',
    description: 'View the source code, contribute, or fork for your own projects',
    to: 'https://github.com/tomhundley/ncf-grant-demo',
    external: true,
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
        />
      </svg>
    ),
  },
];

/**
 * Landing Page Component
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          NCF Grant Management API
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
          A GraphQL API demo showcasing how to manage grants, ministries, donors, and giving funds
        </p>
      </header>

      {/* Pathway Cards */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
          {pathways.map((pathway) => (
            <PathwayCard key={pathway.title} {...pathway} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>Built with React, Apollo Client, and GraphQL</p>
      </footer>
    </div>
  );
}

/**
 * Pathway Card Component
 */
function PathwayCard({
  title,
  description,
  to,
  external,
  icon,
  secondaryLink,
}: {
  title: string;
  description: string;
  to: string;
  external: boolean;
  icon: React.ReactNode;
  secondaryLink?: { label: string; getUrl: () => string };
}) {
  const cardClasses =
    'card hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer group';

  const cardHeader = (
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-primary-50 text-primary-600 rounded-xl flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center">
          {title}
          {external && (
            <svg
              className="w-4 h-4 ml-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          )}
        </h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );

  // Card with secondary link - use div wrapper with separate links
  if (secondaryLink) {
    return (
      <div className={cardClasses.replace('cursor-pointer', '')}>
        <a href={to} className="block hover:opacity-80 transition-opacity">
          {cardHeader}
        </a>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4">
          <a
            href={to}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            SpectaQL Docs
            <svg
              className="w-3.5 h-3.5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a
            href={secondaryLink.getUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            {secondaryLink.label}
            <svg
              className="w-3.5 h-3.5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // External link
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
      >
        {cardHeader}
      </a>
    );
  }

  // Internal React Router link
  return (
    <Link to={to} className={cardClasses}>
      {cardHeader}
    </Link>
  );
}
