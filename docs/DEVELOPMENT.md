# Development Guide

Complete guide for setting up and developing the Ministry Grant Tracker application.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Environment Variables](#environment-variables)
- [Database Management](#database-management)
- [Code Style](#code-style)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x+ | JavaScript runtime |
| npm | 9.x+ | Package manager |
| Docker | 20.x+ | Local PostgreSQL container |
| Git | 2.x+ | Version control |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| VS Code | IDE with excellent TypeScript support |
| Prisma VS Code Extension | Schema highlighting and formatting |
| Apollo GraphQL Extension | GraphQL syntax support |
| Docker Desktop | GUI for container management |

### VS Code Extensions

```json
{
  "recommendations": [
    "prisma.prisma",
    "apollographql.vscode-apollo",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/tomhundley/ncf-grant-demo.git
cd ncf-grant-demo
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

This installs dependencies for:
- Root workspace (concurrently for running both servers)
- `/server` - GraphQL backend
- `/client` - React frontend

### 3. Start PostgreSQL

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name ncf-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=ncf_demo \
  -p 5433:5432 \
  postgres:15-alpine
```

**Note:** We use port `5433` to avoid conflicts with any existing PostgreSQL installations on the default port `5432`.

### 4. Configure Environment

```bash
# Create server environment file
echo 'DATABASE_URL="postgresql://postgres:devpassword@localhost:5433/ncf_demo"' > server/.env
```

### 5. Initialize Database

```bash
cd server

# Run database migrations
npx prisma migrate dev

# Seed with demo data
npx prisma db seed

cd ..
```

### 6. Start Development Servers

**Option A: Both servers at once (recommended)**
```bash
npm run dev
```

**Option B: Separate terminals**
```bash
# Terminal 1 - GraphQL Server
cd server && npm run dev

# Terminal 2 - React Client
cd client && npm run dev
```

### 7. Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| React App | http://localhost:5173 | Main application UI |
| GraphQL Playground | http://localhost:4000 | Interactive API explorer |
| Prisma Studio | http://localhost:5555 | Database GUI (run `npm run db:studio`) |

---

## Project Structure

```
graphql-demo/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── graphql/           # Query and mutation definitions
│   │   ├── lib/               # Utilities (Apollo client config)
│   │   ├── pages/             # Route page components
│   │   ├── App.tsx            # Main app with routing
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                    # GraphQL Backend
│   ├── prisma/
│   │   ├── migrations/        # Database migrations
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Demo data seeding
│   ├── src/
│   │   ├── resolvers/         # GraphQL resolver functions
│   │   │   ├── index.ts       # Resolver aggregation
│   │   │   ├── ministry.resolvers.ts
│   │   │   ├── donor.resolvers.ts
│   │   │   ├── givingFund.resolvers.ts
│   │   │   ├── grant.resolvers.ts
│   │   │   └── dashboard.resolvers.ts
│   │   ├── schema/
│   │   │   └── typeDefs.ts    # GraphQL schema definitions
│   │   ├── context.ts         # GraphQL context with Prisma
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── api/                       # Vercel Serverless (alternative)
│   └── graphql.ts             # Serverless function handler
│
├── docs/                      # Documentation
│   ├── API_REFERENCE.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── SECURITY.md
│
├── package.json               # Workspace root
├── tsconfig.json              # Root TypeScript config
├── vercel.json                # Vercel deployment config
└── README.md
```

---

## Development Workflow

### Daily Development

```bash
# Start PostgreSQL (if not running)
docker start ncf-postgres

# Start both servers
npm run dev
```

### Making Schema Changes

1. **Edit the Prisma schema** (`server/prisma/schema.prisma`)

2. **Generate migration**
   ```bash
   cd server
   npx prisma migrate dev --name describe_your_change
   ```

3. **Prisma generates TypeScript types automatically**

4. **Update GraphQL schema** (`server/src/schema/typeDefs.ts`)

5. **Add/update resolvers** in `server/src/resolvers/`

6. **Update client queries/mutations** in `client/src/graphql/`

### Adding a New Feature

1. **Backend First**
   - Add types to `typeDefs.ts`
   - Add resolver functions
   - Test in GraphQL Playground

2. **Frontend Second**
   - Add queries/mutations to `client/src/graphql/`
   - Create or update components/pages
   - Test in browser

### Code Regeneration

After changing the Prisma schema:

```bash
cd server

# Regenerate Prisma client
npx prisma generate

# Format schema
npx prisma format
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `PORT` | No | `4000` | GraphQL server port |
| `NODE_ENV` | No | `development` | Environment mode |

**Example:**
```bash
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
PORT=4000
NODE_ENV=development
```

### Client (`client/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_GRAPHQL_URI` | No | `http://localhost:4000` | GraphQL API endpoint |

**Example:**
```bash
VITE_GRAPHQL_URI=http://localhost:4000
```

### Production Environment Variables

For production deployment, also set:

```bash
# Server
DATABASE_URL="postgresql://..."  # Production database
NODE_ENV=production

# Client (Vercel)
VITE_GRAPHQL_URI=https://your-api-domain.com
```

---

## Database Management

### Common Commands

```bash
cd server

# View database in browser GUI
npx prisma studio

# Run pending migrations
npx prisma migrate deploy

# Reset database (WARNING: destroys data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Format schema file
npx prisma format

# View migration history
npx prisma migrate status
```

### Seeding Data

The seed script populates demo data:

```bash
cd server
npx prisma db seed
```

Seed data includes:
- 12 ministries (various categories)
- 5 donors
- 8 giving funds
- 10 grants (various statuses)

### Resetting to Clean State

```bash
cd server

# Drop all data and re-run migrations + seed
npx prisma migrate reset
```

### Direct Database Access

```bash
# Connect to PostgreSQL CLI
docker exec -it ncf-postgres psql -U postgres -d ncf_demo

# Or use Prisma Studio
cd server && npx prisma studio
```

---

## Code Style

### TypeScript

- Strict mode enabled
- Explicit return types on functions
- No implicit `any`
- Null checks enforced

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GrantStatusBadge.tsx` |
| Pages | PascalCase | `MinistriesPage.tsx` |
| Utilities | camelCase | `apollo.ts` |
| Types | PascalCase | `Ministry`, `Grant` |

### GraphQL Naming

| Type | Convention | Example |
|------|------------|---------|
| Types | PascalCase | `GivingFund` |
| Queries | camelCase | `givingFunds` |
| Mutations | camelCase | `createGrantRequest` |
| Inputs | PascalCase + Input | `CreateGrantInput` |
| Enums | SCREAMING_SNAKE | `PENDING`, `APPROVED` |

### Formatting

```bash
# Format all code
npm run format

# Lint
npm run lint
```

---

## Testing

### Current Status

This demo project does not include tests. For production applications, consider:

### Recommended Testing Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit Tests | Vitest | Component and utility testing |
| Integration | Supertest | API endpoint testing |
| E2E | Playwright | Full application flows |
| GraphQL | EasyGraphQL Tester | Schema and resolver testing |

### Example Test Setup

```typescript
// server/__tests__/resolvers/ministry.test.ts
import { createTestContext } from '../test-utils';
import { ministryResolvers } from '../../src/resolvers/ministry.resolvers';

describe('Ministry Resolvers', () => {
  it('should create a ministry', async () => {
    const ctx = createTestContext();
    const result = await ministryResolvers.Mutation.createMinistry(
      null,
      { input: { name: 'Test Ministry', category: 'CHURCH' } },
      ctx
    );
    expect(result.name).toBe('Test Ministry');
  });
});
```

---

## Troubleshooting

### Database Connection Failed

**Error:** `Can't reach database server`

**Solutions:**
1. Check Docker is running: `docker ps`
2. Start PostgreSQL: `docker start ncf-postgres`
3. Verify port: `docker port ncf-postgres`
4. Check connection string in `.env`

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solutions:**
```bash
# Find process using port
lsof -i :4000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd server
npx prisma generate
```

### GraphQL Schema Errors

**Error:** `Unknown type "SomeType"`

**Solutions:**
1. Check `typeDefs.ts` for typos
2. Restart the server after schema changes
3. Check import/export statements

### Client Can't Connect to Server

**Error:** Network error in Apollo Client

**Solutions:**
1. Verify server is running on port 4000
2. Check CORS configuration
3. Verify `VITE_GRAPHQL_URI` environment variable
4. Check browser developer tools for specific errors

### Docker Container Won't Start

**Error:** Container name already in use

**Solution:**
```bash
# Remove old container
docker rm ncf-postgres

# Start fresh
docker run -d \
  --name ncf-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=ncf_demo \
  -p 5433:5432 \
  postgres:15-alpine
```

### Migration Failed

**Error:** Migration failed to apply

**Solutions:**
1. Check for syntax errors in schema
2. Reset database: `npx prisma migrate reset`
3. Check database permissions

---

## Available Scripts

### Root Workspace

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `concurrently...` | Start both servers |
| `npm run build` | - | Build both packages |
| `npm install` | - | Install all dependencies |

### Server

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `tsx watch src/index.ts` | Start with hot reload |
| `npm run build` | `tsc` | Compile TypeScript |
| `npm start` | `node dist/index.js` | Run production build |
| `npm run db:migrate` | `prisma migrate dev` | Run migrations |
| `npm run db:seed` | `prisma db seed` | Seed demo data |
| `npm run db:studio` | `prisma studio` | Open database GUI |

### Client

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start Vite dev server |
| `npm run build` | `tsc && vite build` | Production build |
| `npm run preview` | `vite preview` | Preview production build |
| `npm run lint` | `eslint .` | Run ESLint |
