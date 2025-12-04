# Syncly Database Schema

This document describes the Supabase database schema for Syncly, including tables, relationships, Row Level Security (RLS) policies, and helper functions.

## Overview

Syncly uses a multi-tenant architecture where workspaces contain team members (developers) managed by tech leads. The schema enforces strict data isolation through RLS policies to ensure privacy and security.

## Tables

### workspaces

The root entity for multi-tenancy. Each workspace represents an organization or team.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Workspace display name |
| slug | text | Unique URL-friendly identifier |
| created_at | timestamptz | Creation timestamp |
| subscription_status | text | One of: `trialing`, `active`, `canceled` |

### workspace_members

Junction table linking users to workspaces with their role.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| workspace_id | uuid | Foreign key to workspaces |
| user_id | uuid | Foreign key to auth.users |
| role | text | One of: `admin`, `tech_lead` |
| created_at | timestamptz | Creation timestamp |

**Constraints:**
- Unique constraint on (workspace_id, user_id) - a user can only have one role per workspace

### developers

Team members being managed by tech leads. These are the people having 1:1s.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| workspace_id | uuid | Foreign key to workspaces |
| tech_lead_id | uuid | Foreign key to auth.users (the managing tech lead) |
| name | text | Developer's full name |
| seniority | text | One of: `junior`, `mid`, `senior`, `staff`, `principal` |
| stack | text[] | Array of technologies (e.g., `['React', 'Node.js', 'PostgreSQL']`) |
| current_goals | text | Current development goals or focus areas |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp (auto-updated via trigger) |

### one_on_ones

Records of 1:1 meetings between tech leads and their developers.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| developer_id | uuid | Foreign key to developers |
| tech_lead_id | uuid | Foreign key to auth.users |
| date | date | Date of the 1:1 meeting |
| duration | text | Duration of the meeting (e.g., "30 minutes", "1 hour") |
| tags | text[] | Array of tags for categorization (e.g., `['career', 'feedback', 'goals']`) |
| notes | text | Meeting notes and discussion points |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp (auto-updated via trigger) |

### audit_logs

Immutable audit trail for tracking user actions within workspaces.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| workspace_id | uuid | Foreign key to workspaces |
| user_id | uuid | Foreign key to auth.users (who performed the action) |
| action | text | Action performed (e.g., `created_developer`, `exported_report`) |
| resource_type | text | Type of resource affected (e.g., `developer`, `one_on_one`) |
| resource_id | uuid | ID of the affected resource (nullable) |
| metadata | jsonb | Additional context about the action (nullable) |
| created_at | timestamptz | When the action occurred |

**Note:** Audit logs are immutable - no UPDATE or DELETE operations are permitted.

## Entity Relationship Diagram

```
auth.users (Supabase Auth)
    │
    ├──< workspace_members >── workspaces
    │         │
    │         └── role: admin | tech_lead
    │
    ├──< developers
    │         │
    │         ├── workspace_id ──> workspaces
    │         └── tech_lead_id ──> auth.users
    │
    ├──< one_on_ones
    │         │
    │         ├── developer_id ──> developers
    │         └── tech_lead_id ──> auth.users
    │
    └──< audit_logs
              │
              ├── workspace_id ──> workspaces
              └── user_id ──> auth.users
```

## Row Level Security (RLS) Policies

RLS ensures data isolation and privacy at the database level.

### Workspaces

| Policy | Operation | Rule |
|--------|-----------|------|
| View | SELECT | User must be a member of the workspace |
| Update | UPDATE | User must be an admin of the workspace |
| Delete | DELETE | User must be an admin of the workspace |
| Create | INSERT | Any authenticated user can create a workspace |

### Workspace Members

| Policy | Operation | Rule |
|--------|-----------|------|
| View | SELECT | User must be a member of the workspace |
| Add | INSERT | User must be an admin OR be the first member (creator) |
| Update | UPDATE | User must be an admin of the workspace |
| Remove | DELETE | User must be an admin of the workspace |

### Developers

| Policy | Operation | Rule |
|--------|-----------|------|
| View | SELECT | User is the tech lead of the developer OR is a workspace admin |
| Create | INSERT | User is the tech lead being assigned AND is a workspace member |
| Update | UPDATE | User is the tech lead of the developer |
| Delete | DELETE | User is the tech lead of the developer |

**Note:** Admins can view developers for reporting purposes but cannot edit them.

### One-on-Ones

| Policy | Operation | Rule |
|--------|-----------|------|
| View | SELECT | User is the tech lead AND owns the developer |
| Create | INSERT | User is the tech lead AND owns the developer |
| Update | UPDATE | User is the tech lead AND owns the developer |
| Delete | DELETE | User is the tech lead AND owns the developer |

**Important:** Workspace admins CANNOT view 1:1 data. This ensures privacy of sensitive meeting notes.

### Audit Logs

| Policy | Operation | Rule |
|--------|-----------|------|
| View | SELECT | User is a member of the workspace |
| Create | INSERT | User is creating a log for their own action in their workspace |
| Update | - | Not permitted (immutable) |
| Delete | - | Not permitted (immutable) |

## Helper Functions

### get_user_workspace_id()

Returns the workspace ID for the current authenticated user.

```sql
SELECT public.get_user_workspace_id();
-- Returns: uuid of the user's workspace
```

**Use case:** Automatically filtering queries by workspace without explicitly passing workspace_id.

### is_tech_lead_of_developer(developer_id uuid)

Checks if the current user is the tech lead of a specific developer.

```sql
SELECT public.is_tech_lead_of_developer('developer-uuid-here');
-- Returns: true or false
```

**Use case:** Validating access to developer-specific data in application code.

### is_workspace_member(workspace_id uuid)

Checks if the current user is a member of the specified workspace.

```sql
SELECT public.is_workspace_member('workspace-uuid-here');
-- Returns: true or false
```

### is_workspace_admin(workspace_id uuid)

Checks if the current user is an admin of the specified workspace.

```sql
SELECT public.is_workspace_admin('workspace-uuid-here');
-- Returns: true or false
```

### is_workspace_tech_lead(workspace_id uuid)

Checks if the current user is a tech lead in the specified workspace.

```sql
SELECT public.is_workspace_tech_lead('workspace-uuid-here');
-- Returns: true or false
```

## Indexes

The following indexes are created for query performance:

| Index | Table | Column(s) | Purpose |
|-------|-------|-----------|---------|
| idx_developers_tech_lead_id | developers | tech_lead_id | Fast lookup of developers by tech lead |
| idx_developers_workspace_id | developers | workspace_id | Workspace-scoped queries |
| idx_one_on_ones_developer_id | one_on_ones | developer_id | Fast lookup of 1:1s by developer |
| idx_one_on_ones_date | one_on_ones | date | Date-based queries and sorting |
| idx_one_on_ones_tech_lead_id | one_on_ones | tech_lead_id | Tech lead queries |
| idx_audit_logs_workspace_created | audit_logs | (workspace_id, created_at DESC) | Workspace audit log queries with time ordering |
| idx_workspace_members_user_id | workspace_members | user_id | User membership lookups |
| idx_workspace_members_workspace_id | workspace_members | workspace_id | Workspace member listings |

## Triggers

### Updated At Trigger

Tables with `updated_at` columns (`developers`, `one_on_ones`) have triggers that automatically update the timestamp on any UPDATE operation.

## Testing the Schema

You can test the schema in the Supabase SQL Editor:

### 1. Create a workspace and become admin

```sql
-- First, create a workspace
INSERT INTO workspaces (name, slug) VALUES ('My Team', 'my-team');

-- Then add yourself as admin (use your auth.uid())
INSERT INTO workspace_members (workspace_id, user_id, role)
SELECT w.id, auth.uid(), 'admin'
FROM workspaces w WHERE w.slug = 'my-team';
```

### 2. Add a developer

```sql
INSERT INTO developers (workspace_id, tech_lead_id, name, seniority, stack)
SELECT 
  (SELECT id FROM workspaces WHERE slug = 'my-team'),
  auth.uid(),
  'John Doe',
  'mid',
  ARRAY['TypeScript', 'React', 'Node.js'];
```

### 3. Create a 1:1 record

```sql
INSERT INTO one_on_ones (developer_id, tech_lead_id, date, duration, tags, notes)
SELECT 
  d.id,
  auth.uid(),
  CURRENT_DATE,
  '30 minutes',
  ARRAY['career', 'goals'],
  'Discussed career progression and Q4 goals.'
FROM developers d
WHERE d.name = 'John Doe';
```

### 4. Verify RLS is working

```sql
-- This should only return developers you manage
SELECT * FROM developers;

-- This should only return your 1:1s
SELECT * FROM one_on_ones;

-- Test the helper function
SELECT public.get_user_workspace_id();
```

## Migration File Location

The schema is defined in:

```
/supabase/migrations/20241126000000_initial_schema.sql
```

To apply the migration, use the Supabase CLI:

```bash
supabase db push
```

Or apply directly in the Supabase Dashboard SQL Editor.
