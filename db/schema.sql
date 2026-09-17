CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text,
  client_email text NOT NULL,
  business_name text NOT NULL,
  package_name text NOT NULL,
  total_cents integer NOT NULL CHECK (total_cents > 0),
  status text NOT NULL DEFAULT 'materials review',
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  target_date date,
  next_action text NOT NULL DEFAULT 'Complete the materials checklist.',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  label text NOT NULL,
  percent integer NOT NULL CHECK (percent > 0 AND percent <= 100),
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'due', 'paid')),
  sort_order integer NOT NULL,
  stripe_session_id text UNIQUE,
  paid_at timestamptz
);

CREATE TABLE IF NOT EXISTS project_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  label text NOT NULL,
  status text NOT NULL DEFAULT 'needed' CHECK (status IN ('needed', 'received', 'approved')),
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS provider_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  provider text NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'requested', 'connected')),
  UNIQUE (project_id, provider)
);

CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_projects_clerk_user_idx ON client_projects(clerk_user_id);
CREATE INDEX IF NOT EXISTS client_projects_email_idx ON client_projects(lower(client_email));
CREATE INDEX IF NOT EXISTS payment_milestones_project_idx ON payment_milestones(project_id, sort_order);
