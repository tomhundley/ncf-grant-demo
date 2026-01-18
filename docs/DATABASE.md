# Database Schema Documentation

Complete reference for the Ministry Grant Tracker database schema.

---

## Table of Contents

- [Overview](#overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tables](#tables)
- [Enums](#enums)
- [Indexes](#indexes)
- [Relationships](#relationships)
- [Migrations](#migrations)
- [Seeding](#seeding)

---

## Overview

The database uses PostgreSQL and is managed through Prisma ORM. The schema models a donor-advised fund grant management system with four core entities:

| Entity | Purpose |
|--------|---------|
| **Ministry** | Charitable organizations that receive grants |
| **Donor** | Individuals who establish giving funds |
| **GivingFund** | Donor-advised fund accounts holding charitable assets |
| **Grant** | Financial distributions from funds to ministries |

---

## Entity Relationship Diagram

```
┌─────────────────┐          ┌─────────────────┐
│     Donor       │          │    Ministry     │
├─────────────────┤          ├─────────────────┤
│ id (PK)         │          │ id (PK)         │
│ firstName       │          │ name            │
│ lastName        │          │ ein (UNIQUE)    │
│ email (UNIQUE)  │          │ category        │
│ phone           │          │ description     │
│ createdAt       │          │ mission         │
│ updatedAt       │          │ website         │
└────────┬────────┘          │ city            │
         │                   │ state           │
         │ 1:N               │ country         │
         │                   │ verified        │
         ▼                   │ active          │
┌─────────────────┐          │ createdAt       │
│   GivingFund    │          │ updatedAt       │
├─────────────────┤          └────────▲────────┘
│ id (PK)         │                   │
│ name            │                   │ N:1
│ description     │                   │
│ balance         │          ┌────────┴────────┐
│ donorId (FK)    │          │     Grant       │
│ active          │          ├─────────────────┤
│ createdAt       │──────────│ id (PK)         │
│ updatedAt       │   1:N    │ amount          │
└─────────────────┘          │ status          │
                             │ purpose         │
                             │ notes           │
                             │ givingFundId(FK)│
                             │ ministryId (FK) │
                             │ requestedAt     │
                             │ approvedAt      │
                             │ fundedAt        │
                             │ rejectedAt      │
                             │ updatedAt       │
                             └─────────────────┘
```

---

## Tables

### Ministry

Represents churches, charities, and nonprofit organizations that can receive grants.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `SERIAL` | No | Auto-increment | Primary key |
| `name` | `VARCHAR(255)` | No | - | Organization name |
| `ein` | `VARCHAR(10)` | Yes | - | IRS Employer ID Number (unique) |
| `category` | `MinistryCategory` | No | - | Classification enum |
| `description` | `TEXT` | Yes | - | Detailed description |
| `mission` | `TEXT` | Yes | - | Mission statement |
| `website` | `VARCHAR(255)` | Yes | - | Website URL |
| `city` | `VARCHAR(100)` | Yes | - | Headquarters city |
| `state` | `VARCHAR(50)` | Yes | - | State/province |
| `country` | `VARCHAR(50)` | No | `'USA'` | Country |
| `verified` | `BOOLEAN` | No | `false` | Grant eligibility status |
| `active` | `BOOLEAN` | No | `true` | Accepting grants |
| `createdAt` | `TIMESTAMP` | No | `now()` | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | No | Auto-update | Last modification |

**Constraints:**
- `ein` must be unique when provided
- `name` has implicit index for search

---

### Donor

Represents individuals or families who have established giving funds.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `SERIAL` | No | Auto-increment | Primary key |
| `firstName` | `VARCHAR(100)` | No | - | First name |
| `lastName` | `VARCHAR(100)` | No | - | Last name |
| `email` | `VARCHAR(255)` | No | - | Email (unique) |
| `phone` | `VARCHAR(20)` | Yes | - | Phone number |
| `createdAt` | `TIMESTAMP` | No | `now()` | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | No | Auto-update | Last modification |

**Constraints:**
- `email` must be unique
- Composite index on `(lastName, firstName)` for name searches

---

### GivingFund

A donor-advised fund account that holds charitable assets.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `SERIAL` | No | Auto-increment | Primary key |
| `name` | `VARCHAR(255)` | No | - | Fund name |
| `description` | `TEXT` | Yes | - | Fund purpose |
| `balance` | `DECIMAL(15,2)` | No | `0` | Available balance |
| `donorId` | `INTEGER` | No | - | Owner donor (FK) |
| `active` | `BOOLEAN` | No | `true` | Fund status |
| `createdAt` | `TIMESTAMP` | No | `now()` | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | No | Auto-update | Last modification |

**Constraints:**
- `donorId` references `Donor(id)` with `ON DELETE CASCADE`
- Balance uses `DECIMAL(15,2)` for precise currency amounts

---

### Grant

Represents a grant distribution from a giving fund to a ministry.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `SERIAL` | No | Auto-increment | Primary key |
| `amount` | `DECIMAL(15,2)` | No | - | Grant amount USD |
| `status` | `GrantStatus` | No | `'PENDING'` | Workflow status |
| `purpose` | `TEXT` | Yes | - | Grant purpose |
| `notes` | `TEXT` | Yes | - | Internal notes |
| `givingFundId` | `INTEGER` | No | - | Source fund (FK) |
| `ministryId` | `INTEGER` | No | - | Recipient (FK) |
| `requestedAt` | `TIMESTAMP` | No | `now()` | Request timestamp |
| `approvedAt` | `TIMESTAMP` | Yes | - | Approval timestamp |
| `fundedAt` | `TIMESTAMP` | Yes | - | Funding timestamp |
| `rejectedAt` | `TIMESTAMP` | Yes | - | Rejection timestamp |
| `updatedAt` | `TIMESTAMP` | No | Auto-update | Last modification |

**Constraints:**
- `givingFundId` references `GivingFund(id)` with `ON DELETE CASCADE`
- `ministryId` references `Ministry(id)` with `ON DELETE RESTRICT`

**Note:** The `ON DELETE RESTRICT` on `ministryId` prevents deleting a ministry that has associated grants, preserving financial history.

---

## Enums

### MinistryCategory

```sql
CREATE TYPE "MinistryCategory" AS ENUM (
  'CHURCH',        -- Local churches and congregations
  'MISSIONS',      -- Domestic and international missions
  'EDUCATION',     -- Christian schools, universities
  'HUMANITARIAN',  -- Disaster relief, poverty alleviation
  'YOUTH',         -- Youth ministry and camps
  'MEDIA',         -- Christian broadcasting, publishing
  'HEALTHCARE',    -- Medical missions, hospitals
  'ADVOCACY',      -- Pro-life, religious liberty
  'OTHER'          -- Miscellaneous ministries
);
```

### GrantStatus

```sql
CREATE TYPE "GrantStatus" AS ENUM (
  'PENDING',   -- Awaiting review
  'APPROVED',  -- Approved, awaiting funding
  'FUNDED',    -- Distributed to ministry
  'REJECTED'   -- Request declined
);
```

---

## Indexes

### Ministry Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `Ministry_pkey` | `id` | Primary key |
| `Ministry_ein_key` | `ein` | Unique constraint |
| `Ministry_category_idx` | `category` | Filter by category |
| `Ministry_verified_active_idx` | `(verified, active)` | Filter active verified |
| `Ministry_name_idx` | `name` | Name search |

### Donor Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `Donor_pkey` | `id` | Primary key |
| `Donor_email_key` | `email` | Unique constraint |
| `Donor_email_idx` | `email` | Email lookup |
| `Donor_lastName_firstName_idx` | `(lastName, firstName)` | Name search |

### GivingFund Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `GivingFund_pkey` | `id` | Primary key |
| `GivingFund_donorId_idx` | `donorId` | Donor's funds lookup |
| `GivingFund_active_idx` | `active` | Filter active funds |

### Grant Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| `Grant_pkey` | `id` | Primary key |
| `Grant_status_idx` | `status` | Filter by status |
| `Grant_givingFundId_idx` | `givingFundId` | Fund's grants lookup |
| `Grant_ministryId_idx` | `ministryId` | Ministry's grants lookup |
| `Grant_requestedAt_idx` | `requestedAt` | Date-based queries |

---

## Relationships

### One-to-Many

| Parent | Child | Relationship |
|--------|-------|--------------|
| `Donor` | `GivingFund` | A donor can have many giving funds |
| `GivingFund` | `Grant` | A fund can have many grants |
| `Ministry` | `Grant` | A ministry can receive many grants |

### Foreign Key Behavior

| Relationship | ON DELETE | Reason |
|--------------|-----------|--------|
| `GivingFund.donorId → Donor.id` | `CASCADE` | Delete funds when donor is removed |
| `Grant.givingFundId → GivingFund.id` | `CASCADE` | Delete grants when fund is removed |
| `Grant.ministryId → Ministry.id` | `RESTRICT` | Preserve grant history |

---

## Migrations

### Current Migration

The initial migration (`20260116033241_init`) creates all tables, enums, and indexes.

### Running Migrations

```bash
# Development: create and apply migration
cd server
npx prisma migrate dev --name describe_change

# Production: apply pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (WARNING: destroys data)
npx prisma migrate reset
```

### Migration Best Practices

1. **Always backup** before production migrations
2. **Test migrations** in development first
3. **Use descriptive names**: `add_phone_to_donor`, `create_audit_log`
4. **Review generated SQL** before applying

---

## Seeding

### Seed Script

Located at `server/prisma/seed.ts`, creates demo data:

| Entity | Count | Notes |
|--------|-------|-------|
| Ministries | 12 | Various categories |
| Donors | 5 | Sample individuals |
| GivingFunds | 8 | Multiple per donor |
| Grants | 10 | Various statuses |

### Running Seeds

```bash
cd server

# Run seed script
npx prisma db seed

# Seed is also run automatically with migrate reset
npx prisma migrate reset
```

### Seed Configuration

In `server/package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## Query Examples

### Raw SQL Examples

```sql
-- Get all verified ministries with funded grant totals
SELECT
  m.id,
  m.name,
  m.category,
  COALESCE(SUM(g.amount), 0) as total_funded
FROM "Ministry" m
LEFT JOIN "Grant" g ON g."ministryId" = m.id AND g.status = 'FUNDED'
WHERE m.verified = true
GROUP BY m.id
ORDER BY total_funded DESC;

-- Get donor balances
SELECT
  d.id,
  d."firstName" || ' ' || d."lastName" as name,
  COALESCE(SUM(gf.balance), 0) as total_balance
FROM "Donor" d
LEFT JOIN "GivingFund" gf ON gf."donorId" = d.id
GROUP BY d.id;

-- Grant workflow timeline
SELECT
  id,
  amount,
  status,
  "requestedAt",
  "approvedAt",
  "fundedAt",
  "rejectedAt",
  CASE
    WHEN "fundedAt" IS NOT NULL THEN "fundedAt" - "requestedAt"
    WHEN "rejectedAt" IS NOT NULL THEN "rejectedAt" - "requestedAt"
    ELSE NULL
  END as processing_time
FROM "Grant"
ORDER BY "requestedAt" DESC;
```

### Prisma Query Examples

```typescript
// Get ministry with grant counts
const ministry = await prisma.ministry.findUnique({
  where: { id: 1 },
  include: {
    grants: {
      select: {
        status: true,
        amount: true,
      },
    },
  },
});

// Get donor with funds and balances
const donor = await prisma.donor.findUnique({
  where: { id: 1 },
  include: {
    givingFunds: {
      select: {
        name: true,
        balance: true,
        _count: {
          select: { grants: true },
        },
      },
    },
  },
});

// Paginated ministries with filter
const ministries = await prisma.ministry.findMany({
  where: {
    category: 'MISSIONS',
    verified: true,
  },
  take: 20,
  skip: 0,
  orderBy: { name: 'asc' },
});
```

---

## Performance Considerations

### Index Usage

The current indexes optimize these common queries:

- Filter ministries by category
- Find verified/active ministries
- Search ministries by name
- Lookup grants by status
- Find grants for a fund or ministry
- Date-range queries on grants

### Query Optimization

1. **Use pagination** for large result sets
2. **Select only needed fields** to reduce payload
3. **Use includes strategically** to prevent N+1 queries
4. **Consider materialized views** for complex aggregations

### Connection Pooling

For production, configure connection pooling:

```bash
# Prisma Data Proxy or PgBouncer
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=20"
```
