# GraphQL API Reference

Complete reference for the Ministry Grant Tracker GraphQL API.

**Base URL:** `http://localhost:4000` (development) | `https://ncf-demo.thomashundley.com/api/graphql` (production)

---

## Table of Contents

- [Custom Scalars](#custom-scalars)
- [Enums](#enums)
- [Types](#types)
- [Queries](#queries)
- [Mutations](#mutations)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Custom Scalars

### DateTime

ISO 8601 date-time string format.

```graphql
scalar DateTime
```

**Example values:**
- `"2024-01-15T10:30:00.000Z"`
- `"2024-12-25T00:00:00Z"`

### Decimal

Precision decimal for financial amounts. Stored as `Decimal(15, 2)` in the database.

```graphql
scalar Decimal
```

**Example values:**
- `"10000.00"`
- `"5250.75"`

---

## Enums

### MinistryCategory

Categories for classifying ministries by their primary mission focus.

| Value | Description |
|-------|-------------|
| `CHURCH` | Local churches and congregations |
| `MISSIONS` | Domestic and international mission organizations |
| `EDUCATION` | Christian schools, universities, seminaries |
| `HUMANITARIAN` | Disaster relief, poverty alleviation, food banks |
| `YOUTH` | Youth ministry, camps, and mentorship programs |
| `MEDIA` | Christian broadcasting, publishing, and digital media |
| `HEALTHCARE` | Medical missions, hospitals, and healthcare outreach |
| `ADVOCACY` | Pro-life, religious liberty, and advocacy organizations |
| `OTHER` | Miscellaneous ministries not fitting other categories |

### GrantStatus

Grant lifecycle status values.

| Value | Description |
|-------|-------------|
| `PENDING` | Grant request submitted, awaiting review |
| `APPROVED` | Grant approved by fund advisor, awaiting disbursement |
| `FUNDED` | Grant funds have been distributed to the ministry |
| `REJECTED` | Grant request was declined |

**Workflow:**
```
PENDING ──┬── approveGrant() ──→ APPROVED ──→ fundGrant() ──→ FUNDED
          │
          └── rejectGrant() ──→ REJECTED
```

---

## Types

### Ministry

A charitable organization that can receive grants.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int!` | Unique identifier |
| `name` | `String!` | Organization name |
| `ein` | `String` | IRS Employer Identification Number |
| `category` | `MinistryCategory!` | Primary ministry category |
| `description` | `String` | Detailed description |
| `mission` | `String` | Mission statement |
| `website` | `String` | Organization website URL |
| `city` | `String` | Headquarters city |
| `state` | `String` | State or province |
| `country` | `String!` | Country (defaults to "USA") |
| `verified` | `Boolean!` | Grant eligibility status |
| `active` | `Boolean!` | Whether accepting grants |
| `createdAt` | `DateTime!` | Creation timestamp |
| `updatedAt` | `DateTime!` | Last update timestamp |
| `grants` | `[Grant!]!` | All grants received |
| `totalFunded` | `Decimal!` | Sum of funded grants |
| `grantCounts` | `GrantCounts!` | Counts by status |

### Donor

An individual who has established one or more giving funds.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int!` | Unique identifier |
| `firstName` | `String!` | First name |
| `lastName` | `String!` | Last name |
| `fullName` | `String!` | Computed full name |
| `email` | `String!` | Email address (unique) |
| `phone` | `String` | Phone number |
| `createdAt` | `DateTime!` | Creation timestamp |
| `updatedAt` | `DateTime!` | Last update timestamp |
| `givingFunds` | `[GivingFund!]!` | All giving funds owned |
| `totalBalance` | `Decimal!` | Sum of all fund balances |

### GivingFund

A donor-advised fund that holds charitable assets.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int!` | Unique identifier |
| `name` | `String!` | Fund name |
| `description` | `String` | Fund purpose description |
| `balance` | `Decimal!` | Current available balance |
| `active` | `Boolean!` | Whether the fund is active |
| `createdAt` | `DateTime!` | Creation timestamp |
| `updatedAt` | `DateTime!` | Last update timestamp |
| `donor` | `Donor!` | Fund owner |
| `donorId` | `Int!` | Donor ID |
| `grants` | `[Grant!]!` | All grants from this fund |
| `totalDisbursed` | `Decimal!` | Sum of funded grants |
| `grantCounts` | `GrantCounts!` | Counts by status |

### Grant

A grant from a giving fund to a ministry.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `Int!` | Unique identifier |
| `amount` | `Decimal!` | Grant amount in USD |
| `status` | `GrantStatus!` | Current status |
| `purpose` | `String` | Grant purpose description |
| `notes` | `String` | Internal advisor notes |
| `requestedAt` | `DateTime!` | Request timestamp |
| `approvedAt` | `DateTime` | Approval timestamp |
| `fundedAt` | `DateTime` | Funding timestamp |
| `rejectedAt` | `DateTime` | Rejection timestamp |
| `updatedAt` | `DateTime!` | Last update timestamp |
| `givingFund` | `GivingFund!` | Source fund |
| `givingFundId` | `Int!` | Giving fund ID |
| `ministry` | `Ministry!` | Recipient ministry |
| `ministryId` | `Int!` | Ministry ID |

### GrantCounts

Aggregated grant counts by status.

| Field | Type | Description |
|-------|------|-------------|
| `pending` | `Int!` | Count of pending grants |
| `approved` | `Int!` | Count of approved grants |
| `funded` | `Int!` | Count of funded grants |
| `rejected` | `Int!` | Count of rejected grants |
| `total` | `Int!` | Total grant count |

### DashboardStats

Aggregated statistics for the dashboard.

| Field | Type | Description |
|-------|------|-------------|
| `totalMinistries` | `Int!` | Total ministry count |
| `verifiedMinistries` | `Int!` | Verified ministry count |
| `totalDonors` | `Int!` | Total donor count |
| `totalFunds` | `Int!` | Total giving fund count |
| `totalBalance` | `Decimal!` | Sum of all fund balances |
| `totalDisbursed` | `Decimal!` | Sum of all funded grants |
| `pendingAmount` | `Decimal!` | Sum of pending grants |
| `grantsByStatus` | `GrantCounts!` | Grant counts by status |

### PageInfo (Pagination)

Relay-style pagination information.

| Field | Type | Description |
|-------|------|-------------|
| `hasNextPage` | `Boolean!` | More items available forward |
| `hasPreviousPage` | `Boolean!` | More items available backward |
| `startCursor` | `String` | First item cursor |
| `endCursor` | `String` | Last item cursor |
| `totalCount` | `Int!` | Total items across all pages |

---

## Queries

### ministry

Get a single ministry by ID.

```graphql
query GetMinistry($id: Int!) {
  ministry(id: $id) {
    id
    name
    category
    verified
    totalFunded
    grants {
      id
      amount
      status
    }
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `Int!` | Yes | Ministry ID |

**Returns:** `Ministry` or `null` if not found

---

### ministries

Get paginated list of ministries with filtering.

```graphql
query ListMinistries($first: Int, $after: String, $filter: MinistryFilter) {
  ministries(first: $first, after: $after, filter: $filter) {
    edges {
      cursor
      node {
        id
        name
        category
        verified
        city
        state
      }
    }
    pageInfo {
      hasNextPage
      endCursor
      totalCount
    }
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `first` | `Int` | No | Items per page (default: 20, max: 100) |
| `after` | `String` | No | Cursor for forward pagination |
| `filter` | `MinistryFilter` | No | Filter criteria |

**MinistryFilter Input:**
| Field | Type | Description |
|-------|------|-------------|
| `category` | `MinistryCategory` | Filter by category |
| `verified` | `Boolean` | Filter by verification status |
| `active` | `Boolean` | Filter by active status |
| `search` | `String` | Case-insensitive name search |
| `state` | `String` | Filter by state |

**Returns:** `MinistryConnection!`

---

### donor

Get a single donor by ID.

```graphql
query GetDonor($id: Int!) {
  donor(id: $id) {
    id
    firstName
    lastName
    email
    totalBalance
    givingFunds {
      id
      name
      balance
    }
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `Int!` | Yes | Donor ID |

**Returns:** `Donor` or `null` if not found

---

### donors

Get all donors.

```graphql
query GetAllDonors {
  donors {
    id
    firstName
    lastName
    email
    totalBalance
  }
}
```

**Returns:** `[Donor!]!`

---

### givingFund

Get a single giving fund by ID.

```graphql
query GetGivingFund($id: Int!) {
  givingFund(id: $id) {
    id
    name
    balance
    donor {
      fullName
    }
    grants {
      id
      amount
      status
      ministry {
        name
      }
    }
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `Int!` | Yes | Giving fund ID |

**Returns:** `GivingFund` or `null` if not found

---

### givingFunds

Get all giving funds, optionally filtered by donor.

```graphql
query GetGivingFunds($donorId: Int) {
  givingFunds(donorId: $donorId) {
    id
    name
    balance
    donor {
      fullName
    }
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `donorId` | `Int` | No | Filter by donor ID |

**Returns:** `[GivingFund!]!`

---

### grant

Get a single grant by ID.

```graphql
query GetGrant($id: Int!) {
  grant(id: $id) {
    id
    amount
    status
    purpose
    requestedAt
    approvedAt
    fundedAt
    ministry {
      name
    }
    givingFund {
      name
      balance
    }
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `Int!` | Yes | Grant ID |

**Returns:** `Grant` or `null` if not found

---

### grants

Get grants with optional filtering.

```graphql
query GetGrants($status: GrantStatus, $ministryId: Int, $givingFundId: Int) {
  grants(status: $status, ministryId: $ministryId, givingFundId: $givingFundId) {
    id
    amount
    status
    purpose
    ministry {
      name
    }
    givingFund {
      name
    }
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `status` | `GrantStatus` | No | Filter by status |
| `ministryId` | `Int` | No | Filter by ministry |
| `givingFundId` | `Int` | No | Filter by giving fund |

**Returns:** `[Grant!]!`

---

### dashboardStats

Get aggregated statistics for the dashboard.

```graphql
query GetDashboardStats {
  dashboardStats {
    totalMinistries
    verifiedMinistries
    totalDonors
    totalFunds
    totalBalance
    totalDisbursed
    pendingAmount
    grantsByStatus {
      pending
      approved
      funded
      rejected
      total
    }
  }
}
```

**Returns:** `DashboardStats!`

---

## Mutations

### createMinistry

Create a new ministry. New ministries are unverified by default.

```graphql
mutation CreateMinistry($input: CreateMinistryInput!) {
  createMinistry(input: $input) {
    id
    name
    category
    verified
    createdAt
  }
}
```

**Input Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String!` | Yes | Organization name |
| `category` | `MinistryCategory!` | Yes | Ministry category |
| `ein` | `String` | No | EIN number |
| `description` | `String` | No | Description |
| `mission` | `String` | No | Mission statement |
| `website` | `String` | No | Website URL |
| `city` | `String` | No | City |
| `state` | `String` | No | State |
| `country` | `String` | No | Country (defaults to "USA") |

**Returns:** `Ministry!`

---

### updateMinistry

Update an existing ministry.

```graphql
mutation UpdateMinistry($id: Int!, $input: UpdateMinistryInput!) {
  updateMinistry(id: $id, input: $input) {
    id
    name
    verified
    updatedAt
  }
}
```

**Returns:** `Ministry` or `null` if not found

---

### deleteMinistry

Delete a ministry. Fails if the ministry has associated grants.

```graphql
mutation DeleteMinistry($id: Int!) {
  deleteMinistry(id: $id)
}
```

**Returns:** `Boolean!` - `true` if deleted successfully

---

### verifyMinistry

Mark a ministry as verified for grant eligibility.

```graphql
mutation VerifyMinistry($id: Int!) {
  verifyMinistry(id: $id) {
    id
    verified
  }
}
```

**Returns:** `Ministry` or `null` if not found

---

### createDonor

Create a new donor.

```graphql
mutation CreateDonor($input: CreateDonorInput!) {
  createDonor(input: $input) {
    id
    firstName
    lastName
    email
    createdAt
  }
}
```

**Input Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | `String!` | Yes | First name |
| `lastName` | `String!` | Yes | Last name |
| `email` | `String!` | Yes | Email (must be unique) |
| `phone` | `String` | No | Phone number |

**Returns:** `Donor!`

---

### createGivingFund

Create a new giving fund for a donor.

```graphql
mutation CreateGivingFund($input: CreateGivingFundInput!) {
  createGivingFund(input: $input) {
    id
    name
    balance
    donor {
      fullName
    }
  }
}
```

**Input Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String!` | Yes | Fund name |
| `donorId` | `Int!` | Yes | Owner donor ID |
| `description` | `String` | No | Description |
| `initialBalance` | `Decimal` | No | Starting balance (default: 0) |

**Returns:** `GivingFund!`

---

### addFunds

Add funds (contribution) to a giving fund.

```graphql
mutation AddFunds($fundId: Int!, $amount: Decimal!) {
  addFunds(fundId: $fundId, amount: $amount) {
    id
    balance
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `fundId` | `Int!` | Yes | Giving fund ID |
| `amount` | `Decimal!` | Yes | Amount to add (must be positive) |

**Returns:** `GivingFund` or `null` if not found

---

### createGrantRequest

Create a new grant request. The grant starts in PENDING status.

```graphql
mutation CreateGrantRequest($input: CreateGrantInput!) {
  createGrantRequest(input: $input) {
    id
    amount
    status
    purpose
    ministry {
      name
    }
    givingFund {
      name
      balance
    }
  }
}
```

**Input Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | `Decimal!` | Yes | Grant amount |
| `givingFundId` | `Int!` | Yes | Source fund ID |
| `ministryId` | `Int!` | Yes | Recipient ministry ID |
| `purpose` | `String` | No | Grant purpose |

**Returns:** `Grant!`

---

### approveGrant

Approve a pending grant request. Changes status from PENDING to APPROVED.

```graphql
mutation ApproveGrant($id: Int!) {
  approveGrant(id: $id) {
    id
    status
    approvedAt
  }
}
```

**Returns:** `Grant` or `null` if not found

**Errors:**
- Throws if grant is not in PENDING status

---

### rejectGrant

Reject a grant request with optional reason.

```graphql
mutation RejectGrant($id: Int!, $reason: String) {
  rejectGrant(id: $id, reason: $reason) {
    id
    status
    notes
    rejectedAt
  }
}
```

**Arguments:**
| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `Int!` | Yes | Grant ID |
| `reason` | `String` | No | Rejection reason (saved to notes) |

**Returns:** `Grant` or `null` if not found

---

### fundGrant

Fund an approved grant (disburse to ministry). This is an **atomic transaction** that:
1. Validates the grant is in APPROVED status
2. Checks the giving fund has sufficient balance
3. Deducts the amount from the giving fund
4. Updates the grant status to FUNDED
5. Sets the fundedAt timestamp

```graphql
mutation FundGrant($id: Int!) {
  fundGrant(id: $id) {
    id
    status
    fundedAt
    givingFund {
      balance  # Reduced by grant amount
    }
    ministry {
      totalFunded  # Increased by grant amount
    }
  }
}
```

**Returns:** `Grant` or `null` if not found

**Errors:**
- Throws if grant is not in APPROVED status
- Throws if giving fund has insufficient balance

---

## Error Handling

GraphQL errors are returned in the standard `errors` array format:

```json
{
  "data": null,
  "errors": [
    {
      "message": "Grant must be APPROVED before funding",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["fundGrant"],
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `BAD_USER_INPUT` | Invalid input data or business rule violation |
| `NOT_FOUND` | Requested resource doesn't exist |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

---

## Examples

### Complete Grant Workflow

```graphql
# 1. Create a grant request
mutation CreateGrant {
  createGrantRequest(input: {
    amount: "5000.00"
    givingFundId: 1
    ministryId: 3
    purpose: "Support for youth summer camp program"
  }) {
    id
    status
  }
}

# 2. Approve the grant (returns grant with id from step 1)
mutation ApproveGrant {
  approveGrant(id: 1) {
    id
    status
    approvedAt
  }
}

# 3. Fund the grant (atomic transaction)
mutation FundGrant {
  fundGrant(id: 1) {
    id
    status
    fundedAt
    givingFund {
      balance
    }
    ministry {
      totalFunded
    }
  }
}
```

### Paginated Ministry List with Filters

```graphql
query FilteredMinistries {
  ministries(
    first: 10
    filter: {
      category: MISSIONS
      verified: true
      search: "international"
    }
  ) {
    edges {
      cursor
      node {
        id
        name
        city
        state
        totalFunded
      }
    }
    pageInfo {
      hasNextPage
      endCursor
      totalCount
    }
  }
}
```

### Nested Relationship Loading

```graphql
query DonorWithFullDetails {
  donor(id: 1) {
    fullName
    email
    totalBalance
    givingFunds {
      name
      balance
      grantCounts {
        pending
        funded
        total
      }
      grants {
        amount
        status
        ministry {
          name
          category
        }
      }
    }
  }
}
```
