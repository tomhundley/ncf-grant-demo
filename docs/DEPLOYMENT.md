# Deployment Guide

Complete guide for deploying the Ministry Grant Tracker to production.

---

## Table of Contents

- [Architecture Options](#architecture-options)
- [Database Hosting](#database-hosting)
- [Option 1: Vercel Deployment](#option-1-vercel-deployment)
- [Option 2: Standalone Server](#option-2-standalone-server)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)

---

## Architecture Options

### Option 1: Vercel + Serverless API

Best for: Simple deployments, low-traffic applications, cost-effective.

```
┌─────────────────────────────────────────────────────────┐
│                        Vercel                           │
│  ┌─────────────────┐    ┌─────────────────────────┐    │
│  │  React Client   │    │  /api/graphql (Edge)    │    │
│  │  (Static/SSR)   │───▶│  Apollo Server          │    │
│  └─────────────────┘    └───────────┬─────────────┘    │
└─────────────────────────────────────┼───────────────────┘
                                      │
                          ┌───────────▼───────────┐
                          │  Supabase/Neon/Railway│
                          │  (PostgreSQL)         │
                          └───────────────────────┘
```

### Option 2: Separate Frontend + Backend

Best for: Higher traffic, more control, dedicated server resources.

```
┌──────────────────┐          ┌──────────────────┐
│  Vercel/Netlify  │          │  Railway/Render  │
│  React Client    │─────────▶│  Apollo Server   │
│  (Static)        │          │  (Node.js)       │
└──────────────────┘          └────────┬─────────┘
                                       │
                          ┌────────────▼────────────┐
                          │  PostgreSQL Database    │
                          └─────────────────────────┘
```

---

## Database Hosting

### Supabase (Recommended)

Free tier includes PostgreSQL with 500MB storage.

1. **Create account** at [supabase.com](https://supabase.com)

2. **Create new project**
   - Choose region closest to your users
   - Set a strong database password

3. **Get connection string**
   - Go to Settings → Database
   - Copy the connection string (URI format)

```bash
# Format
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Railway

Simple PostgreSQL provisioning with generous free tier.

1. **Create account** at [railway.app](https://railway.app)

2. **New Project → Add PostgreSQL**

3. **Get connection string** from Variables tab

### Neon

Serverless PostgreSQL with branching support.

1. **Create account** at [neon.tech](https://neon.tech)

2. **Create project** and database

3. **Get connection string** from dashboard

---

## Option 1: Vercel Deployment

This option deploys both the React client and GraphQL API to Vercel.

### Prerequisites

- Vercel account
- GitHub repository connected
- Production database ready

### Step 1: Configure vercel.json

The project includes a `vercel.json` configuration:

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/graphql",
      "destination": "/api/graphql"
    }
  ],
  "functions": {
    "api/graphql.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### Step 2: Deploy to Vercel

**Via CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel
```

**Via Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Select your repository
4. Configure project settings (auto-detected)
5. Add environment variables
6. Deploy

### Step 3: Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Production |
| `NODE_ENV` | `production` | Production |

### Step 4: Configure Database

Run migrations against production database:

```bash
# Set production DATABASE_URL temporarily
export DATABASE_URL="postgresql://..."

cd server
npx prisma migrate deploy
npx prisma db seed  # Optional: seed demo data
```

### Step 5: Verify Deployment

1. **Client:** Visit your Vercel URL
2. **API:** Visit `https://your-domain.vercel.app/api/graphql`

---

## Option 2: Standalone Server

Deploy the GraphQL server separately on Railway, Render, or any Node.js host.

### Railway Deployment

#### Step 1: Connect Repository

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Configure:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`

#### Step 2: Add PostgreSQL

1. In your Railway project, click **+ New**
2. Select **Database → PostgreSQL**
3. Railway automatically links the `DATABASE_URL`

#### Step 3: Environment Variables

Railway auto-creates `DATABASE_URL`. Add any additional variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `${{PORT}}` (Railway provides this) |

#### Step 4: Run Migrations

```bash
# Connect to Railway CLI
railway login
railway link

# Run migrations
railway run npx prisma migrate deploy
railway run npx prisma db seed  # Optional
```

### Render Deployment

#### Step 1: Create Web Service

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect repository
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`

#### Step 2: Add PostgreSQL

1. New → PostgreSQL
2. Copy the **Internal Database URL**

#### Step 3: Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Internal PostgreSQL URL |
| `NODE_ENV` | `production` |

### Client Deployment (Vercel/Netlify)

Deploy the React client separately:

#### Vercel

```bash
cd client
vercel
```

Environment variables:
```
VITE_GRAPHQL_URI=https://your-server-domain.railway.app
```

#### Netlify

1. Connect repository
2. Build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

---

## Environment Configuration

### Production Checklist

- [ ] Secure `DATABASE_URL` (SSL enabled)
- [ ] `NODE_ENV=production`
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled (recommended)
- [ ] Error logging configured
- [ ] Health check endpoint working

### Database SSL

Most managed databases require SSL. Add to connection string:

```
?sslmode=require
```

Full example:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

### CORS Configuration

Update `server/src/index.ts` for production:

```typescript
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Allow your production domains
const corsOptions = {
  origin: [
    'https://your-domain.com',
    'https://your-domain.vercel.app',
  ],
  credentials: true,
};
```

---

## Post-Deployment

### Verify the Deployment

1. **Health Check**
   ```bash
   curl https://your-api.com/health
   ```

2. **GraphQL Introspection**
   ```bash
   curl -X POST https://your-api.com/api/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ __typename }"}'
   ```

3. **Test Query**
   ```bash
   curl -X POST https://your-api.com/api/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ dashboardStats { totalMinistries } }"}'
   ```

### Database Migrations

Always run migrations before deploying new code:

```bash
# Vercel: use local CLI with production DATABASE_URL
export DATABASE_URL="postgresql://..."
cd server && npx prisma migrate deploy

# Railway
railway run npx prisma migrate deploy

# Render: add to build command
npm install && npx prisma migrate deploy && npm start
```

---

## Monitoring

### Recommended Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Vercel Analytics | Frontend performance | Free tier |
| Railway Metrics | Server metrics | Included |
| Sentry | Error tracking | Free tier |
| Logtail | Log aggregation | Free tier |

### Apollo Studio

For GraphQL-specific monitoring:

1. Create account at [studio.apollographql.com](https://studio.apollographql.com)
2. Create a graph
3. Add Apollo Server plugin:

```typescript
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginUsageReporting({
      sendReportsImmediately: true,
    }),
  ],
});
```

4. Set environment variable:
```
APOLLO_KEY=service:your-graph:your-api-key
```

### Health Check Endpoint

Add a health check to `server/src/index.ts`:

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

---

## Cost Estimates

### Free Tier Options

| Service | Free Tier Limits |
|---------|------------------|
| Vercel | 100GB bandwidth, serverless functions |
| Supabase | 500MB database, 2GB bandwidth |
| Railway | $5 free credit/month |
| Render | 750 hours free/month (spins down) |
| Neon | 3GB storage, 1 project |

### Production Tier (Low Traffic)

| Service | ~Monthly Cost |
|---------|---------------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Railway Starter | ~$5-20 |
| **Total** | **$50-65/month** |

---

## Rollback Procedures

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Railway

1. Go to Deployments tab
2. Click on previous deployment
3. Click "Redeploy"

### Database

Always backup before migrations:

```bash
# Export current state
pg_dump $DATABASE_URL > backup.sql

# Restore if needed
psql $DATABASE_URL < backup.sql
```
