import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSql } from "@/lib/db";
import { getClientWorkspace } from "@/lib/client-workspace";
import { AGREEMENT_VERSION, AGREEMENT_PDF } from "@/lib/agreement";
import { siteConfig } from "@/config/site.config";
import { clerkConfigured } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";

export default async function MaterialsPage() {
  if (!clerkConfigured || !databaseConfigured) redirect("/client");
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const project = await getClientWorkspace(user.id, user.primaryEmailAddress?.emailAddress ?? null);
  if (!project) redirect("/client");
  const sql = getSql();
  const accepted = await sql`SELECT id FROM project_updates WHERE project_id = ${project.id} AND title = 'Build agreement accepted' AND body = ${`Agreement ${AGREEMENT_VERSION}; client ${user.id}; materials handoff authorized.`} LIMIT 1` as unknown as { id: string }[];
  if (!accepted.length) redirect("/client");
  return <main className="workspace-shell"><section className="workspace-panel">
    <h1>Your materials, your ownership.</h1>
    <p>Your acceptance of agreement {AGREEMENT_VERSION} is recorded. Sending content allows us to use it for the agreed build; you retain ownership.</p>
    <p>Email approved copy, images, and content links. Do not email passwords, payment details, or secret keys. Provider access uses scoped invitations.</p>
    <a href={`mailto:${siteConfig.business.email}?subject=${encodeURIComponent(`Push2Start materials — ${project.businessName}`)}`}>Prepare materials email ↗</a>
    <p>This opens your email app. Review and send the message there; this page does not upload files.</p>
    <p><a href={AGREEMENT_PDF}>Download accepted agreement</a> · <Link href="/client">Back to workspace</Link></p>
  </section></main>;
}
