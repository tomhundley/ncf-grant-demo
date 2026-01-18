/**
 * =============================================================================
 * Tech Stack Page
 * =============================================================================
 *
 * Detailed overview of the technologies used in this demo.
 * Deep dive into GraphQL concepts, queries, mutations, and architecture.
 */

import { Link } from "react-router-dom";
import { MobileNav } from "../components/MobileNav";
import { useEffect } from "react";

/**
 * Code block component for displaying syntax-highlighted code
 */
function CodeBlock({ code, language = "graphql" }: { code: string; language?: string }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue-600/20 to-purple-600/20 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500" />
      <pre className="relative bg-midnight-950 border border-white/10 rounded-xl p-4 overflow-x-auto">
        <code className="text-sm font-mono text-slate-300 whitespace-pre">{code}</code>
      </pre>
      <div className="absolute top-2 right-2 text-xs text-slate-500 uppercase tracking-wider">
        {language}
      </div>
    </div>
  );
}

/**
 * Tech card component
 */
function TechCard({
  icon,
  name,
  description,
  features,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  features: string[];
  color: string;
}) {
  return (
    <div className="glass-panel p-6 hover:border-white/20 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start text-sm text-slate-300">
            <svg className="w-4 h-4 text-neon-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Section component with consistent styling
 */
function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-slate-400 text-lg">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function TechStackPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-midnight-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center text-electric-blue-300 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium tracking-wide text-sm uppercase">Return Home</span>
          </Link>
          <div className="hidden sm:block text-cyber-gold-400 font-serif italic text-lg tracking-wider">
            Tech Stack
          </div>
          <Link
            to="/demo"
            className="text-sm font-bold text-neon-green-400 hover:text-neon-green-300 transition-colors uppercase tracking-wider"
          >
            See Demo →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-electric-blue-100 to-electric-blue-300 animate-fade-in-up">
          Tech Stack
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          A modern full-stack architecture built for scalability, type safety, and developer experience.
          <br />
          <span className="text-white font-medium">Deep dive into every technology powering this demo.</span>
        </p>
      </section>

      {/* Quick Nav */}
      <nav className="max-w-5xl mx-auto px-4 mb-16">
        <div className="glass-panel p-4 flex flex-wrap justify-center gap-3">
          {["GraphQL", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"].map((tech) => (
            <a
              key={tech}
              href={`#${tech.toLowerCase().replace(/\./g, "")}`}
              className="px-4 py-2 bg-midnight-800/50 hover:bg-electric-blue-600/20 border border-white/10 hover:border-electric-blue-500/50 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-all"
            >
              {tech}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pb-32 space-y-24">

        {/* Technology Overview */}
        <Section id="overview" title="Technology Overview" subtitle="The building blocks of modern web development">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TechCard
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}
              name="GraphQL"
              description="A query language for APIs that gives clients the power to ask for exactly what they need."
              features={["Strongly typed schema", "Single endpoint", "Real-time subscriptions", "Introspection"]}
              color="bg-pink-600/20 border border-pink-500/30"
            />
            <TechCard
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>}
              name="React"
              description="A JavaScript library for building user interfaces with a component-based architecture."
              features={["Virtual DOM", "Hooks API", "Component composition", "Declarative UI"]}
              color="bg-cyan-600/20 border border-cyan-500/30"
            />
            <TechCard
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>}
              name="TypeScript"
              description="A typed superset of JavaScript that compiles to plain JavaScript."
              features={["Static type checking", "IDE intelligence", "Refactoring support", "Type inference"]}
              color="bg-blue-600/20 border border-blue-500/30"
            />
            <TechCard
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/></svg>}
              name="Node.js"
              description="JavaScript runtime built on Chrome's V8 engine for server-side development."
              features={["Event-driven", "Non-blocking I/O", "NPM ecosystem", "Cross-platform"]}
              color="bg-green-600/20 border border-green-500/30"
            />
            <TechCard
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="10" ry="6"/></svg>}
              name="PostgreSQL"
              description="The world's most advanced open source relational database."
              features={["ACID compliant", "JSON support", "Full-text search", "Extensible"]}
              color="bg-indigo-600/20 border border-indigo-500/30"
            />
            <TechCard
              icon={<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z"/></svg>}
              name="Tailwind CSS"
              description="A utility-first CSS framework for rapidly building custom designs."
              features={["Utility classes", "JIT compilation", "Responsive design", "Dark mode"]}
              color="bg-teal-600/20 border border-teal-500/30"
            />
          </div>
        </Section>

        {/* GraphQL Deep Dive */}
        <Section id="graphql" title="GraphQL Deep Dive" subtitle="Understanding the query language that powers this API">

          <div className="space-y-12">
            {/* What is GraphQL */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">What is GraphQL?</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                GraphQL is a query language for your API, and a server-side runtime for executing queries. Unlike REST APIs where you have multiple endpoints returning fixed data structures, GraphQL exposes a single endpoint that lets clients request exactly the data they need—nothing more, nothing less.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-midnight-800/50 rounded-xl p-6 border border-white/5">
                  <h4 className="text-lg font-bold text-red-400 mb-3">REST Approach</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>• GET /api/grants - Returns all grant fields</li>
                    <li>• GET /api/grants/1/ministry - Separate call</li>
                    <li>• GET /api/grants/1/donor - Another call</li>
                    <li>• Over-fetching or under-fetching data</li>
                    <li>• Multiple round trips to server</li>
                  </ul>
                </div>
                <div className="bg-midnight-800/50 rounded-xl p-6 border border-neon-green-500/20">
                  <h4 className="text-lg font-bold text-neon-green-400 mb-3">GraphQL Approach</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Single POST /graphql endpoint</li>
                    <li>• Request exactly what you need</li>
                    <li>• Get nested related data in one call</li>
                    <li>• No over-fetching or under-fetching</li>
                    <li>• Single round trip for complex queries</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Schema */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">The Schema</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                The GraphQL schema is the contract between the client and server. It defines what data can be queried and what operations can be performed. Our schema defines types for Ministries, Donors, Grants, and their relationships.
              </p>
              <CodeBlock language="graphql" code={`type Ministry {
  id: ID!
  name: String!
  ein: String
  category: MinistryCategory!
  description: String
  mission: String
  website: String
  city: String
  state: String
  verified: Boolean!
  totalFunded: Money!
  grants: [Grant!]!        # Related grants
  createdAt: DateTime!
}

type Grant {
  id: ID!
  amount: Money!
  status: GrantStatus!
  purpose: String
  ministry: Ministry!      # Related ministry
  donor: Donor!            # Related donor
  requestedAt: DateTime!
  approvedAt: DateTime
}`} />
            </div>

            {/* Queries */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Queries: Reading Data</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Queries are used to fetch data from the server. They're read-only operations that don't modify any data. In this demo, we use queries to list ministries, donors, grants, and fetch dashboard statistics.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-electric-blue-400 mb-3">Simple Query</h4>
                  <p className="text-slate-400 text-sm mb-3">Fetch a list of ministries with specific fields:</p>
                  <CodeBlock code={`query ListMinistries {
  ministries(first: 10) {
    edges {
      node {
        id
        name
        category
        verified
        totalFunded
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-electric-blue-400 mb-3">Query with Variables</h4>
                  <p className="text-slate-400 text-sm mb-3">Use variables to make queries dynamic and reusable:</p>
                  <CodeBlock code={`query GetMinistry($id: ID!) {
  ministry(id: $id) {
    id
    name
    description
    mission
    grants {
      id
      amount
      status
      donor {
        name
      }
    }
  }
}

# Variables:
# { "id": "1" }`} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-electric-blue-400 mb-3">Filtering & Pagination</h4>
                  <p className="text-slate-400 text-sm mb-3">Our API supports cursor-based pagination and filters:</p>
                  <CodeBlock code={`query FilteredGrants($filter: GrantFilter, $first: Int, $after: String) {
  grants(filter: $filter, first: $first, after: $after) {
    edges {
      node {
        id
        amount
        status
        ministry {
          name
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}

# Variables:
# {
#   "filter": { "status": "APPROVED", "minAmount": "10000" },
#   "first": 20
# }`} />
                </div>
              </div>
            </div>

            {/* Mutations */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Mutations: Writing Data</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Mutations are used to create, update, or delete data. They modify the state on the server and return the modified data. Every mutation in our API returns the affected object so you can update your local cache.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-cyber-gold-400 mb-3">Create Mutation</h4>
                  <p className="text-slate-400 text-sm mb-3">Create a new ministry record:</p>
                  <CodeBlock code={`mutation CreateMinistry($input: CreateMinistryInput!) {
  createMinistry(input: $input) {
    id
    name
    ein
    category
    verified
    createdAt
  }
}

# Variables:
# {
#   "input": {
#     "name": "Grace Community Church",
#     "ein": "12-3456789",
#     "category": "CHURCH",
#     "city": "Atlanta",
#     "state": "GA"
#   }
# }`} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-cyber-gold-400 mb-3">Update Mutation</h4>
                  <p className="text-slate-400 text-sm mb-3">Update an existing record with partial data:</p>
                  <CodeBlock code={`mutation UpdateMinistry($id: ID!, $input: UpdateMinistryInput!) {
  updateMinistry(id: $id, input: $input) {
    id
    name
    verified
    mission
  }
}

# Variables:
# {
#   "id": "1",
#   "input": {
#     "verified": true,
#     "mission": "Spreading the Gospel worldwide"
#   }
# }`} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-cyber-gold-400 mb-3">Delete Mutation</h4>
                  <p className="text-slate-400 text-sm mb-3">Remove a record from the database:</p>
                  <CodeBlock code={`mutation DeleteMinistry($id: ID!) {
  deleteMinistry(id: $id) {
    id
    name
  }
}

# Variables:
# { "id": "1" }`} />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-cyber-gold-400 mb-3">Grant Request Flow</h4>
                  <p className="text-slate-400 text-sm mb-3">Create a grant request and approve it:</p>
                  <CodeBlock code={`# Step 1: Request a grant
mutation RequestGrant($input: RequestGrantInput!) {
  requestGrant(input: $input) {
    id
    amount
    status        # Returns "PENDING"
    purpose
    requestedAt
  }
}

# Step 2: Approve the grant
mutation ApproveGrant($id: ID!) {
  approveGrant(id: $id) {
    id
    status        # Returns "APPROVED"
    approvedAt
  }
}`} />
                </div>
              </div>
            </div>

            {/* Connections Pattern */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Relay Connection Pattern</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                This API implements the Relay Connection specification for pagination. This pattern provides a consistent way to paginate through large datasets using cursors instead of page numbers, which is more efficient and handles real-time data changes better.
              </p>
              <CodeBlock code={`type MinistryConnection {
  edges: [MinistryEdge!]!      # Array of edge objects
  pageInfo: PageInfo!          # Pagination metadata
  totalCount: Int!             # Total items available
}

type MinistryEdge {
  node: Ministry!              # The actual ministry data
  cursor: String!              # Opaque cursor for this item
}

type PageInfo {
  hasNextPage: Boolean!        # More items after?
  hasPreviousPage: Boolean!    # More items before?
  startCursor: String          # First item's cursor
  endCursor: String            # Last item's cursor
}`} />
              <div className="mt-6 bg-midnight-800/50 rounded-xl p-6 border border-white/5">
                <h4 className="text-lg font-semibold text-white mb-3">Why Cursors Over Offsets?</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start">
                    <span className="text-neon-green-400 mr-2">•</span>
                    <span><strong className="text-white">Stable pagination:</strong> New items don't cause duplicates or skipped items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-green-400 mr-2">•</span>
                    <span><strong className="text-white">Performance:</strong> Database can use indexes efficiently with cursors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-green-400 mr-2">•</span>
                    <span><strong className="text-white">Real-time friendly:</strong> Works well with live data updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Apollo Client */}
            <div className="glass-panel p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Apollo Client Integration</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                We use Apollo Client on the frontend to manage GraphQL operations. It provides intelligent caching, optimistic updates, and seamless React integration through hooks.
              </p>
              <CodeBlock language="typescript" code={`// Using Apollo hooks in React components
import { useQuery, useMutation } from '@apollo/client';
import { LIST_MINISTRIES } from '../graphql/queries';
import { CREATE_MINISTRY } from '../graphql/mutations';

function MinistriesPage() {
  // Fetch data with automatic caching
  const { data, loading, error, fetchMore } = useQuery(LIST_MINISTRIES, {
    variables: { first: 10 }
  });

  // Mutation with cache update
  const [createMinistry] = useMutation(CREATE_MINISTRY, {
    refetchQueries: [{ query: LIST_MINISTRIES }],
    onCompleted: (data) => {
      console.log('Created:', data.createMinistry);
    }
  });

  // Load more with cursor pagination
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: data.ministries.pageInfo.endCursor
      }
    });
  };

  // ... render component
}`} />
            </div>
          </div>
        </Section>

        {/* React Section */}
        <Section id="react" title="React Architecture" subtitle="Component-driven UI development">
          <div className="glass-panel p-8">
            <p className="text-slate-300 mb-6 leading-relaxed">
              The frontend is built with React 18, using functional components and hooks throughout. The application structure follows a feature-based organization with shared components for consistency.
            </p>
            <CodeBlock language="typescript" code={`// Project structure
src/
├── components/          # Reusable UI components
│   ├── CategoryBadge.tsx
│   ├── ErrorMessage.tsx
│   ├── LoadingSpinner.tsx
│   └── MinistryForm.tsx
├── layouts/             # Page layout wrappers
│   ├── DemoLayout.tsx   # Navigation header layout
│   └── RootLayout.tsx   # Background & global styles
├── pages/               # Route components
│   ├── Dashboard.tsx
│   ├── MinistriesPage.tsx
│   ├── GrantsPage.tsx
│   └── DonorsPage.tsx
├── graphql/             # GraphQL operations
│   ├── queries.ts       # All query definitions
│   └── mutations.ts     # All mutation definitions
└── App.tsx              # Route configuration`} />
          </div>
        </Section>

        {/* TypeScript Section */}
        <Section id="typescript" title="TypeScript" subtitle="Type safety across the stack">
          <div className="glass-panel p-8">
            <p className="text-slate-300 mb-6 leading-relaxed">
              TypeScript provides end-to-end type safety. The GraphQL schema generates types that are used both on the server (resolvers) and client (React components), ensuring consistency across the entire application.
            </p>
            <CodeBlock language="typescript" code={`// Generated types from GraphQL schema
type Ministry = {
  id: number;
  name: string;
  ein: string | null;
  category: 'CHURCH' | 'MISSIONS' | 'EDUCATION' | 'HUMANITARIAN' | 'MEDIA' | 'YOUTH' | 'OTHER';
  description: string | null;
  mission: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  verified: boolean;
  totalFunded: string;  // Money type as string
  grants: Grant[];
  createdAt: string;    // ISO DateTime
};

// Type-safe component props
interface MinistryCardProps {
  ministry: Ministry;
  onEdit: (ministry: Ministry) => void;
  onDelete: (id: number) => Promise<void>;
}`} />
          </div>
        </Section>

        {/* Node.js Section */}
        <Section id="nodejs" title="Node.js Backend" subtitle="Server-side GraphQL with Apollo Server">
          <div className="glass-panel p-8">
            <p className="text-slate-300 mb-6 leading-relaxed">
              The backend runs on Node.js with Apollo Server, providing the GraphQL API. Resolvers handle data fetching from PostgreSQL, with proper connection pooling and query optimization.
            </p>
            <CodeBlock language="typescript" code={`// Apollo Server setup
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,  // Enable schema introspection
});

// Example resolver
const resolvers = {
  Query: {
    ministries: async (_, { first, after, filter }, { db }) => {
      // Build query with filters
      let query = db('ministries').select('*');

      if (filter?.category) {
        query = query.where('category', filter.category);
      }

      if (filter?.verified) {
        query = query.where('verified', true);
      }

      // Cursor-based pagination
      if (after) {
        const cursor = decodeCursor(after);
        query = query.where('id', '>', cursor);
      }

      const results = await query.limit(first + 1);
      // ... return connection format
    }
  }
};`} />
          </div>
        </Section>

        {/* PostgreSQL Section */}
        <Section id="postgresql" title="PostgreSQL Database" subtitle="Relational data with referential integrity">
          <div className="glass-panel p-8">
            <p className="text-slate-300 mb-6 leading-relaxed">
              PostgreSQL stores all application data with proper foreign key constraints ensuring referential integrity. The schema supports the complex relationships between ministries, donors, and grants.
            </p>
            <CodeBlock language="sql" code={`-- Database schema
CREATE TABLE ministries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ein VARCHAR(10) UNIQUE,
  category ministry_category NOT NULL DEFAULT 'OTHER',
  description TEXT,
  mission TEXT,
  website VARCHAR(255),
  city VARCHAR(100),
  state CHAR(2),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE donors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  donor_type donor_type NOT NULL DEFAULT 'INDIVIDUAL',
  total_given DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grants (
  id SERIAL PRIMARY KEY,
  ministry_id INTEGER NOT NULL REFERENCES ministries(id),
  donor_id INTEGER NOT NULL REFERENCES donors(id),
  amount DECIMAL(15,2) NOT NULL,
  status grant_status NOT NULL DEFAULT 'PENDING',
  purpose TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for common queries
CREATE INDEX idx_grants_status ON grants(status);
CREATE INDEX idx_grants_ministry ON grants(ministry_id);
CREATE INDEX idx_ministries_category ON ministries(category);`} />
          </div>
        </Section>

        {/* Tailwind Section */}
        <Section id="tailwind" title="Tailwind CSS" subtitle="Utility-first styling with custom theme">
          <div className="glass-panel p-8">
            <p className="text-slate-300 mb-6 leading-relaxed">
              Tailwind CSS powers the premium dark theme with custom colors, animations, and component classes. The utility-first approach allows rapid UI development while maintaining design consistency.
            </p>
            <CodeBlock language="javascript" code={`// tailwind.config.cjs - Custom theme
module.exports = {
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#020617",  // Main background
          900: "#0f172a",  // Card backgrounds
          800: "#1e293b",  // Input backgrounds
        },
        "electric-blue": {
          400: "#60a5fa",  // Text highlights
          500: "#3b82f6",  // Primary buttons
          600: "#2563eb",  // Hover states
        },
        "cyber-gold": {
          400: "#fbbf24",  // Accent text
          500: "#f59e0b",  // Gold highlights
        },
        "neon-green": {
          400: "#4ade80",  // Success states
          500: "#22c55e",  // Verified badges
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
      },
    },
  },
};

// Component classes in index.css
@layer components {
  .glass-panel {
    @apply bg-midnight-900/40 backdrop-blur-xl
           border border-white/10 rounded-2xl
           shadow-xl transition-all duration-300;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center
           px-6 py-3 rounded-xl bg-electric-blue-600
           text-white font-bold shadow-lg
           hover:bg-electric-blue-500
           transition-all duration-300;
  }
}`} />
          </div>
        </Section>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-midnight-900 to-midnight-800 rounded-3xl p-8 md:p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-electric-blue-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity" />

          <h2 className="relative text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="relative text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            See these technologies in action with the live demo, or dive into the API with Apollo Sandbox.
          </p>

          <div className="relative flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/demo"
              className="btn-primary text-lg px-10 py-4"
            >
              Launch Demo
            </Link>
            <a
              href="/docs/api/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white/20 text-white hover:bg-white hover:text-midnight-900"
            >
              View API Docs
            </a>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
