import { getSql } from "./db";

export type WorkspaceMilestone = {
  id: string;
  label: string;
  percent: number;
  amountCents: number;
  status: "upcoming" | "due" | "paid";
  paidAt: string | null;
};

export type WorkspaceData = {
  id: string;
  businessName: string;
  packageName: string;
  status: string;
  progress: number;
  targetDate: string | null;
  nextAction: string;
  milestones: WorkspaceMilestone[];
  materials: Array<{ label: string; status: "needed" | "received" | "approved" }>;
  connections: Array<{ provider: string; status: "not_started" | "requested" | "connected" }>;
  updates: Array<{ title: string; body: string; createdAt: string }>;
};

type DbRow = Record<string, unknown>;

export async function getClientWorkspace(userId: string, email: string | null): Promise<WorkspaceData | null> {
  const sql = getSql();
  const projects = await sql`
    SELECT id, business_name, package_name, status, progress, target_date, next_action
    FROM client_projects
    WHERE clerk_user_id = ${userId}
       OR (${email}::text IS NOT NULL AND lower(client_email) = lower(${email}))
    ORDER BY created_at DESC
    LIMIT 1
  ` as unknown as DbRow[];
  if (!projects.length) return null;

  const project = projects[0];
  const [milestonesResult, materialsResult, connectionsResult, updatesResult] = await Promise.all([
    sql`SELECT id, label, percent, amount_cents, status, paid_at FROM payment_milestones WHERE project_id = ${project.id} ORDER BY sort_order`,
    sql`SELECT label, status FROM project_materials WHERE project_id = ${project.id} ORDER BY sort_order`,
    sql`SELECT provider, status FROM provider_connections WHERE project_id = ${project.id} ORDER BY provider`,
    sql`SELECT title, body, created_at FROM project_updates WHERE project_id = ${project.id} ORDER BY created_at DESC LIMIT 6`,
  ]);
  const milestones = milestonesResult as unknown as DbRow[];
  const materials = materialsResult as unknown as DbRow[];
  const connections = connectionsResult as unknown as DbRow[];
  const updates = updatesResult as unknown as DbRow[];

  return {
    id: String(project.id),
    businessName: String(project.business_name),
    packageName: String(project.package_name),
    status: String(project.status),
    progress: Number(project.progress),
    targetDate: project.target_date ? String(project.target_date) : null,
    nextAction: String(project.next_action),
    milestones: milestones.map((row) => ({
      id: String(row.id), label: String(row.label), percent: Number(row.percent), amountCents: Number(row.amount_cents),
      status: row.status as WorkspaceMilestone["status"], paidAt: row.paid_at ? String(row.paid_at) : null,
    })),
    materials: materials.map((row) => ({ label: String(row.label), status: row.status as WorkspaceData["materials"][number]["status"] })),
    connections: connections.map((row) => ({ provider: String(row.provider), status: row.status as WorkspaceData["connections"][number]["status"] })),
    updates: updates.map((row) => ({ title: String(row.title), body: String(row.body), createdAt: String(row.created_at) })),
  };
}

export async function getPayableMilestone(milestoneId: string, userId: string, email: string | null) {
  const sql = getSql();
  const rows = await sql`
    SELECT m.id, m.project_id, m.label, m.amount_cents, p.business_name, p.client_email
    FROM payment_milestones m
    JOIN client_projects p ON p.id = m.project_id
    WHERE m.id = ${milestoneId}
      AND m.status = 'due'
      AND (p.clerk_user_id = ${userId} OR (${email}::text IS NOT NULL AND lower(p.client_email) = lower(${email})))
    LIMIT 1
  ` as unknown as DbRow[];
  return rows[0] ?? null;
}
