-- Syncly Database Schema
-- Migration: Initial schema with tables, RLS policies, helper functions, and indexes

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get the workspace_id for the current authenticated user
CREATE OR REPLACE FUNCTION public.get_user_workspace_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id
  FROM public.workspace_members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Function to check if the current user is the tech lead of a specific developer
CREATE OR REPLACE FUNCTION public.is_tech_lead_of_developer(developer_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.developers d
    WHERE d.id = developer_id
      AND d.tech_lead_id = auth.uid()
  );
$$;

-- Function to check if user is a member of a workspace
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
  );
$$;

-- Function to check if user is an admin of a workspace
CREATE OR REPLACE FUNCTION public.is_workspace_admin(ws_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Function to check if user is a tech lead in a workspace
CREATE OR REPLACE FUNCTION public.is_workspace_tech_lead(ws_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND role = 'tech_lead'
  );
$$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Workspaces table
CREATE TABLE public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  subscription_status text NOT NULL DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'canceled'))
);

-- Workspace members table (junction table for users and workspaces)
CREATE TABLE public.workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'tech_lead')),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- Developers table (team members managed by tech leads)
CREATE TABLE public.developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  tech_lead_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  seniority text NOT NULL CHECK (seniority IN ('junior', 'mid', 'senior', 'staff', 'principal')),
  stack text[] DEFAULT '{}',
  current_goals text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- One-on-ones table (1:1 meeting records)
CREATE TABLE public.one_on_ones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
  tech_lead_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  duration text,
  tags text[] DEFAULT '{}',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Audit logs table (for tracking actions)
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on developers.tech_lead_id for fast lookup of developers by tech lead
CREATE INDEX idx_developers_tech_lead_id ON public.developers(tech_lead_id);

-- Index on developers.workspace_id for workspace-scoped queries
CREATE INDEX idx_developers_workspace_id ON public.developers(workspace_id);

-- Index on one_on_ones.developer_id for fast lookup of 1:1s by developer
CREATE INDEX idx_one_on_ones_developer_id ON public.one_on_ones(developer_id);

-- Index on one_on_ones.date for date-based queries and sorting
CREATE INDEX idx_one_on_ones_date ON public.one_on_ones(date);

-- Index on one_on_ones.tech_lead_id for tech lead queries
CREATE INDEX idx_one_on_ones_tech_lead_id ON public.one_on_ones(tech_lead_id);

-- Composite index on audit_logs for workspace + created_at queries
CREATE INDEX idx_audit_logs_workspace_created ON public.audit_logs(workspace_id, created_at DESC);

-- Index on workspace_members for user lookups
CREATE INDEX idx_workspace_members_user_id ON public.workspace_members(user_id);

-- Index on workspace_members for workspace lookups
CREATE INDEX idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for developers table
CREATE TRIGGER set_developers_updated_at
  BEFORE UPDATE ON public.developers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for one_on_ones table
CREATE TRIGGER set_one_on_ones_updated_at
  BEFORE UPDATE ON public.one_on_ones
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.one_on_ones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- WORKSPACES POLICIES
-- Users can only access workspaces they are members of
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view workspaces they are members of"
  ON public.workspaces
  FOR SELECT
  USING (public.is_workspace_member(id));

CREATE POLICY "Admins can update their workspaces"
  ON public.workspaces
  FOR UPDATE
  USING (public.is_workspace_admin(id))
  WITH CHECK (public.is_workspace_admin(id));

CREATE POLICY "Admins can delete their workspaces"
  ON public.workspaces
  FOR DELETE
  USING (public.is_workspace_admin(id));

-- Anyone authenticated can create a workspace (they become admin)
CREATE POLICY "Authenticated users can create workspaces"
  ON public.workspaces
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- -----------------------------------------------------------------------------
-- WORKSPACE_MEMBERS POLICIES
-- Users can see members of workspaces they belong to
-- Only admins can manage members
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view members of their workspaces"
  ON public.workspace_members
  FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Admins can add members to their workspaces"
  ON public.workspace_members
  FOR INSERT
  WITH CHECK (
    public.is_workspace_admin(workspace_id)
    OR (
      -- Allow first member (creator) to add themselves as admin
      NOT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = workspace_members.workspace_id)
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update members in their workspaces"
  ON public.workspace_members
  FOR UPDATE
  USING (public.is_workspace_admin(workspace_id))
  WITH CHECK (public.is_workspace_admin(workspace_id));

CREATE POLICY "Admins can remove members from their workspaces"
  ON public.workspace_members
  FOR DELETE
  USING (public.is_workspace_admin(workspace_id));

-- -----------------------------------------------------------------------------
-- DEVELOPERS POLICIES
-- Tech leads can only see/edit their own developers
-- Admins can see developers in their workspace but NOT edit them
-- -----------------------------------------------------------------------------

CREATE POLICY "Tech leads can view their own developers"
  ON public.developers
  FOR SELECT
  USING (
    tech_lead_id = auth.uid()
    OR public.is_workspace_admin(workspace_id)
  );

CREATE POLICY "Tech leads can create developers"
  ON public.developers
  FOR INSERT
  WITH CHECK (
    tech_lead_id = auth.uid()
    AND public.is_workspace_member(workspace_id)
  );

CREATE POLICY "Tech leads can update their own developers"
  ON public.developers
  FOR UPDATE
  USING (tech_lead_id = auth.uid())
  WITH CHECK (tech_lead_id = auth.uid());

CREATE POLICY "Tech leads can delete their own developers"
  ON public.developers
  FOR DELETE
  USING (tech_lead_id = auth.uid());

-- -----------------------------------------------------------------------------
-- ONE_ON_ONES POLICIES
-- Tech leads can only see/edit 1:1s for their own developers
-- Admins CANNOT see 1:1 data (privacy protection)
-- -----------------------------------------------------------------------------

CREATE POLICY "Tech leads can view 1:1s for their developers"
  ON public.one_on_ones
  FOR SELECT
  USING (
    tech_lead_id = auth.uid()
    AND public.is_tech_lead_of_developer(developer_id)
  );

CREATE POLICY "Tech leads can create 1:1s for their developers"
  ON public.one_on_ones
  FOR INSERT
  WITH CHECK (
    tech_lead_id = auth.uid()
    AND public.is_tech_lead_of_developer(developer_id)
  );

CREATE POLICY "Tech leads can update 1:1s for their developers"
  ON public.one_on_ones
  FOR UPDATE
  USING (
    tech_lead_id = auth.uid()
    AND public.is_tech_lead_of_developer(developer_id)
  )
  WITH CHECK (
    tech_lead_id = auth.uid()
    AND public.is_tech_lead_of_developer(developer_id)
  );

CREATE POLICY "Tech leads can delete 1:1s for their developers"
  ON public.one_on_ones
  FOR DELETE
  USING (
    tech_lead_id = auth.uid()
    AND public.is_tech_lead_of_developer(developer_id)
  );

-- -----------------------------------------------------------------------------
-- AUDIT_LOGS POLICIES
-- Users can view audit logs for their workspace
-- System/triggers handle inserts (users can insert their own actions)
-- Audit logs should not be updated or deleted
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view audit logs for their workspace"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Users can create audit logs for their actions"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND public.is_workspace_member(workspace_id)
  );

-- No UPDATE or DELETE policies for audit_logs (immutable audit trail)

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.developers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.one_on_ones TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.get_user_workspace_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_tech_lead_of_developer(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_workspace_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_workspace_tech_lead(uuid) TO authenticated;
