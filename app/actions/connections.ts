"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { clerkConfigured } from "@/lib/auth";
import { databaseConfigured, getSql } from "@/lib/db";

export async function requestProviderConnection(formData: FormData) {
  if (!clerkConfigured || !databaseConfigured) throw new Error("Client access is not configured.");
  const { userId } = await auth();
  if (!userId) throw new Error("Sign in to request a connection.");
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const projectId = String(formData.get("projectId") ?? "");
  const provider = String(formData.get("provider") ?? "").slice(0, 80);
  if (!projectId || !provider) throw new Error("Choose a provider.");

  const sql = getSql();
  await sql`
    UPDATE provider_connections c
    SET status = 'requested'
    FROM client_projects p
    WHERE c.project_id = p.id
      AND c.project_id = ${projectId}
      AND c.provider = ${provider}
      AND c.status = 'not_started'
      AND (p.clerk_user_id = ${userId} OR (${email}::text IS NOT NULL AND lower(p.client_email) = lower(${email})) )
  `;
  revalidatePath("/client");
}
