# Security Considerations

Security overview and recommendations for the Ministry Grant Tracker application.

---

## Table of Contents

- [Current Security Status](#current-security-status)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation](#input-validation)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Infrastructure Security](#infrastructure-security)
- [Production Checklist](#production-checklist)

---

## Current Security Status

> **Important:** This is a demonstration application. It does **not** include production-ready authentication or authorization. Before deploying to production with real data, implement the security measures outlined in this document.

### What's Implemented

| Security Measure | Status | Notes |
|------------------|--------|-------|
| Input type validation | Implemented | GraphQL type system enforces types |
| Enum validation | Implemented | Only valid enum values accepted |
| SQL injection prevention | Implemented | Prisma ORM parameterizes queries |
| Business rule validation | Implemented | e.g., balance checks before funding |
| HTTPS | Depends on host | Vercel/Railway provide HTTPS |

### What's NOT Implemented

| Security Measure | Status | Recommendation |
|------------------|--------|----------------|
| Authentication | Not implemented | Add JWT/OAuth |
| Authorization | Not implemented | Add role-based access |
| Rate limiting | Not implemented | Add at API gateway |
| Query complexity limits | Not implemented | Add Apollo plugin |
| Audit logging | Not implemented | Log sensitive operations |
| Data encryption at rest | Not implemented | Use managed DB encryption |

---

## Authentication

### Recommended Implementation

#### Option 1: JWT Authentication

```typescript
// server/src/middleware/auth.ts
import jwt from 'jsonwebtoken';

interface AuthPayload {
  userId: number;
  email: string;
  role: 'DONOR' | 'ADVISOR' | 'ADMIN';
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
}

// In context.ts
export interface Context {
  prisma: PrismaClient;
  user: AuthPayload | null;
}

export async function createContext({ req }): Promise<Context> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = null;

  if (token) {
    try {
      user = verifyToken(token);
    } catch {
      // Invalid token - user remains null
    }
  }

  return { prisma, user };
}
```

#### Option 2: Auth0/Clerk Integration

For managed authentication, consider:

- **Auth0** - Enterprise-grade identity platform
- **Clerk** - Developer-friendly auth with React components
- **Supabase Auth** - If using Supabase for database

```typescript
// Example with Supabase Auth
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function createContext({ req }): Promise<Context> {
  const token = req.headers.authorization?.replace('Bearer ', '');

  const { data: { user }, error } = await supabase.auth.getUser(token);

  return { prisma, user };
}
```

---

## Authorization

### Recommended Role-Based Access Control (RBAC)

#### Role Definitions

| Role | Permissions |
|------|-------------|
| `DONOR` | View own funds, create grant requests, view ministries |
| `ADVISOR` | Approve/reject grants, manage ministries, view all donors |
| `ADMIN` | Full system access, verify ministries, manage users |

#### Implementation Example

```typescript
// server/src/middleware/authorize.ts

type Role = 'DONOR' | 'ADVISOR' | 'ADMIN';

const rolePermissions: Record<Role, string[]> = {
  DONOR: [
    'read:own_funds',
    'read:ministries',
    'create:grant_request',
    'read:own_grants',
  ],
  ADVISOR: [
    'read:all_funds',
    'read:all_grants',
    'approve:grants',
    'reject:grants',
    'fund:grants',
    'manage:ministries',
  ],
  ADMIN: [
    '*', // All permissions
  ],
};

export function authorize(permission: string) {
  return (context: Context) => {
    if (!context.user) {
      throw new Error('Authentication required');
    }

    const userPermissions = rolePermissions[context.user.role];

    if (!userPermissions.includes('*') && !userPermissions.includes(permission)) {
      throw new Error('Insufficient permissions');
    }
  };
}

// Usage in resolver
const resolvers = {
  Mutation: {
    approveGrant: async (_, { id }, context) => {
      authorize('approve:grants')(context);
      // ... rest of resolver
    },
  },
};
```

#### Field-Level Authorization

```typescript
// Protect sensitive fields
const resolvers = {
  Donor: {
    email: (parent, _, context) => {
      // Only show email to the donor themselves or admins
      if (context.user?.role === 'ADMIN' || context.user?.userId === parent.id) {
        return parent.email;
      }
      return null;
    },
  },
};
```

---

## Input Validation

### Current Validation

GraphQL type system provides:
- Type enforcement (Int, String, Boolean)
- Required field enforcement (non-null `!`)
- Enum value validation

### Additional Validation Needed

```typescript
// server/src/validation/schemas.ts
import { z } from 'zod';

export const createMinistrySchema = z.object({
  name: z.string().min(2).max(255),
  ein: z.string().regex(/^\d{2}-\d{7}$/).optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
});

export const createGrantSchema = z.object({
  amount: z.number().positive().max(10000000), // Max $10M
  purpose: z.string().max(1000).optional(),
});

// Usage in resolver
import { createMinistrySchema } from '../validation/schemas';

const resolvers = {
  Mutation: {
    createMinistry: async (_, { input }, context) => {
      const validated = createMinistrySchema.parse(input);
      return context.prisma.ministry.create({ data: validated });
    },
  },
};
```

### Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML/script content
function sanitize(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}
```

---

## Data Protection

### Sensitive Data Identification

| Data Type | Sensitivity | Protection |
|-----------|-------------|------------|
| Donor email | Medium | Restrict access |
| Donor phone | Medium | Restrict access |
| EIN numbers | Low | Public data |
| Fund balances | High | Restrict to owner/admin |
| Grant amounts | Medium | Restrict appropriately |

### Data Masking

```typescript
// Mask sensitive fields for logging
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local[0]}***@${domain}`;
}

function maskPhone(phone: string): string {
  return phone.replace(/\d(?=\d{4})/g, '*');
}
```

### Encryption at Rest

Use managed database encryption:

```bash
# Supabase: Enabled by default
# Railway: Enabled by default
# Neon: Enabled by default
```

### Encryption in Transit

Always use HTTPS:

```bash
# Connection string with SSL
DATABASE_URL="postgresql://...?sslmode=require"
```

---

## API Security

### Rate Limiting

```typescript
// Using express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
});

app.use('/graphql', limiter);
```

### Query Complexity Limits

```typescript
// Apollo Server plugin
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createComplexityLimitRule(1000, {
      // Optional: customize field costs
      scalarCost: 1,
      objectCost: 10,
      listFactor: 20,
    }),
  ],
});
```

### Query Depth Limiting

```typescript
import depthLimit from 'graphql-depth-limit';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    depthLimit(7), // Max depth of 7
  ],
});
```

### Disable Introspection in Production

```typescript
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV === 'production'
    ? [ApolloServerPluginLandingPageDisabled()]
    : [],
});
```

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com']
    : ['http://localhost:5173'],
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
};

app.use(cors(corsOptions));
```

---

## Infrastructure Security

### Environment Variables

Never commit secrets to version control:

```bash
# .gitignore
.env
.env.*
!.env.example
```

Use secret management:
- **Vercel:** Environment Variables UI
- **Railway:** Variables section
- **AWS:** Secrets Manager
- **GCP:** Secret Manager

### Database Security

1. **Use connection pooling** to prevent connection exhaustion
2. **Enable SSL** for database connections
3. **Use least-privilege** database users
4. **Regular backups** with point-in-time recovery

```sql
-- Create limited-privilege user
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE DROP, TRUNCATE ON ALL TABLES IN SCHEMA public FROM app_user;
```

### Logging and Monitoring

```typescript
// Audit log sensitive operations
async function logAuditEvent(event: {
  action: string;
  userId: number;
  resourceType: string;
  resourceId: number;
  details?: object;
}) {
  await prisma.auditLog.create({
    data: {
      ...event,
      timestamp: new Date(),
      ip: request.ip,
    },
  });
}

// Usage
await logAuditEvent({
  action: 'FUND_GRANT',
  userId: context.user.id,
  resourceType: 'Grant',
  resourceId: grant.id,
  details: { amount: grant.amount },
});
```

---

## Production Checklist

### Before Going Live

- [ ] **Authentication implemented** - JWT or OAuth provider
- [ ] **Authorization implemented** - Role-based access control
- [ ] **Rate limiting configured** - Prevent abuse
- [ ] **Query complexity limits** - Prevent DoS
- [ ] **Introspection disabled** - Hide schema in production
- [ ] **CORS restricted** - Only allow production domains
- [ ] **HTTPS enforced** - All traffic encrypted
- [ ] **Environment variables secured** - Not in code
- [ ] **Database SSL enabled** - Encrypted connections
- [ ] **Error messages sanitized** - No stack traces to clients
- [ ] **Audit logging enabled** - Track sensitive operations
- [ ] **Backups configured** - Regular automated backups
- [ ] **Monitoring set up** - Error tracking, performance
- [ ] **Security headers** - HSTS, CSP, X-Frame-Options

### Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

### Ongoing Security

- [ ] **Regular dependency updates** - Check for vulnerabilities
- [ ] **Security scanning** - Use npm audit, Snyk
- [ ] **Penetration testing** - Periodic security assessments
- [ ] **Incident response plan** - Know what to do if breached
- [ ] **Access reviews** - Regularly review user permissions

---

## Vulnerability Reporting

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Email security concerns to: [security@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to respond within 48 hours and will keep you informed of our progress.
