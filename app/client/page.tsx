import { siteConfig } from "@/config/site.config";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { createMilestoneCheckout } from "@/app/actions/payments";
import { requestProviderConnection } from "@/app/actions/connections";
import { clerkConfigured } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { getClientWorkspace } from "@/lib/client-workspace";
import { stripeConfigured } from "@/lib/stripe";
import AgreementAcceptance from "@/app/components/AgreementAcceptance";
import { acceptAgreementForMaterials } from "@/app/actions/materials";
import { AGREEMENT_PDF } from "@/lib/agreement";

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function SetupState() {
  return (
    <main className="workspace-shell workspace-centered">
      <section className="workspace-empty">
        <span className="workspace-kicker">SECURE CLIENT ACCESS</span>
        <h1>The workspace is built and waiting for its production connections.</h1>
        <p>Authentication, project records, and milestone payments activate after Clerk, Neon, and Stripe are connected in Vercel.</p>
        <Link href="/">Return to push2Start</Link>
      </section>
    </main>
  );
}

export default async function ClientPage() {
  if (!clerkConfigured || !databaseConfigured) return <SetupState />;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const workspace = user ? await getClientWorkspace(user.id, email) : null;

  if (!workspace) {
    return (
      <main className="workspace-shell workspace-centered">
        <section className="workspace-empty">
          <span className="workspace-kicker">ACCOUNT CONNECTED</span>
          <h1>Your first project has not been assigned yet.</h1>
          <p>Once your build is accepted, this workspace will show materials, milestones, secure provider connections, payments, and launch progress.</p>
          <a href={`mailto:${siteConfig.business.email}`}>Contact Push2Start</a>
        </section>
      </main>
    );
  }

  const received = workspace.materials.filter((item) => item.status !== "needed").length;
  return (
    <main className="workspace-shell">
      <header className="workspace-nav">
        <Link href="/" className="workspace-brand">push<span>2</span>Start</Link>
        <div><span>{workspace.businessName}</span><UserButton /></div>
      </header>

      <section className="workspace-hero">
        <div>
          <p className="workspace-kicker">CLIENT WORKSPACE / {workspace.packageName}</p>
          <h1>{workspace.businessName}</h1>
          <p>{workspace.nextAction}</p>
        </div>
        <div className="progress-token" style={{ "--progress": `${workspace.progress * 3.6}deg` } as React.CSSProperties}>
          <strong>{workspace.progress}%</strong><span>{workspace.status}</span>
        </div>
      </section>

      <section className="workspace-panel" aria-labelledby="agreement-title">
        <p className="workspace-kicker">01 / BUILD DOCUMENTATION</p>
        <h2 id="agreement-title">Read your agreement before paying or sharing materials.</h2>
        <p>The opening deposit is 50% of your agreed project price, followed by 25% at direction approval and 25% before launch. Production takes 10–14 calendar days from written READY_TO_BUILD confirmation; client delays pause the clock.</p>
        <p>You retain ownership of your materials. Review scope, revisions, refunds, and handoff terms before continuing.</p>
        <p><Link href="/terms" target="_blank">Read the full agreement ↗</Link> · <a href={AGREEMENT_PDF} target="_blank" rel="noopener noreferrer">Download the agreement PDF</a></p>
      </section>

      <section className="workspace-grid">
        <article className="workspace-panel workspace-payments">
          <header><div><span>PAYMENTS</span><h2>50 / 25 / 25</h2></div><small>{stripeConfigured ? "Stripe secured" : "Stripe setup pending"}</small></header>
          <div className="milestone-list">
            {workspace.milestones.map((milestone) => (
              <div className={`milestone milestone-${milestone.status}`} key={milestone.id}>
                <i>{milestone.status === "paid" ? "✓" : `${milestone.percent}%`}</i>
                <div><strong>{milestone.label}</strong><span>{milestone.status === "paid" && milestone.paidAt ? `Paid ${new Date(milestone.paidAt).toLocaleDateString()}` : milestone.status.replace("_", " ")}</span></div>
                <b>{money(milestone.amountCents)}</b>
                {milestone.status === "due" && stripeConfigured && (
                  <form action={createMilestoneCheckout}><input type="hidden" name="milestoneId" value={milestone.id} /><AgreementAcceptance /><button type="submit">{milestone.percent === 50 ? "Pay 50% deposit" : `Pay ${milestone.percent}% milestone`} ↗</button></form>
                )}
              </div>
            ))}
          </div>
        </article>

        <article className="workspace-panel workspace-materials">
          <header><div><span>MATERIALS</span><h2>{received}/{workspace.materials.length} received</h2></div></header>
          <ul>{workspace.materials.map((item) => <li key={item.label}><i className={`status-${item.status}`} /> <span>{item.label}</span><b>{item.status}</b></li>)}</ul>
          <form action={acceptAgreementForMaterials}><AgreementAcceptance /><button type="submit">Continue to materials ↗</button></form>
        </article>

        <article className="workspace-panel workspace-connections">
          <header><div><span>PROVIDER ACCESS</span><h2>Connection status</h2></div></header>
          <p>Passwords and secret keys never belong in messages. Access is granted through provider authorization or a scoped invitation.</p>
          <ul>{workspace.connections.map((connection) => <li key={connection.provider}><strong>{connection.provider}</strong>{connection.status === "not_started" ? <form action={requestProviderConnection}><input type="hidden" name="projectId" value={workspace.id} /><input type="hidden" name="provider" value={connection.provider} /><button type="submit">Request secure link</button></form> : <span className={`connection-${connection.status}`}>{connection.status.replace("_", " ")}</span>}</li>)}</ul>
        </article>

        <article className="workspace-panel workspace-updates">
          <header><div><span>BUILD LOG</span><h2>Latest commits</h2></div></header>
          {workspace.updates.length ? <ol>{workspace.updates.map((update) => <li key={`${update.createdAt}-${update.title}`}><time>{new Date(update.createdAt).toLocaleDateString()}</time><div><strong>{update.title}</strong><p>{update.body}</p></div></li>)}</ol> : <p>Your first build update will appear here.</p>}
        </article>
      </section>
    </main>
  );
}
