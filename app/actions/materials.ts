"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClientWorkspace } from "@/lib/client-workspace";
import { getSql } from "@/lib/db";
import { AGREEMENT_VERSION, requireAgreement } from "@/lib/agreement";

export async function acceptAgreementForMaterials(formData: FormData) {
  requireAgreement(formData);
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const project = await getClientWorkspace(user.id, user.primaryEmailAddress?.emailAddress ?? null);
  if (!project) throw new Error("No project is available for this account.");
  const sql = getSql();
  await sql`INSERT INTO project_updates (project_id, title, body) VALUES (${project.id}, 'Build agreement accepted', ${`Agreement ${AGREEMENT_VERSION}; client ${user.id}; materials handoff authorized.`})`;
  redirect("/client/materials");
}
