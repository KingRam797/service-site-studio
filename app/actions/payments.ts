"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkConfigured } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { getPayableMilestone } from "@/lib/client-workspace";
import { getStripe } from "@/lib/stripe";
import { AGREEMENT_VERSION, AGREEMENT_PDF, requireAgreement } from "@/lib/agreement";
import { getSql } from "@/lib/db";

export async function createMilestoneCheckout(formData: FormData) {
  requireAgreement(formData);
  if (!clerkConfigured || !databaseConfigured || !process.env.STRIPE_SECRET_KEY) {
    throw new Error("Payments are not configured yet.");
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const milestone = await getPayableMilestone(milestoneId, userId, email);
  if (!milestone) throw new Error("This payment is not available.");

  const sql = getSql();
  await sql`INSERT INTO project_updates (project_id, title, body) VALUES (${milestone.project_id}, 'Build agreement accepted', ${`Agreement ${AGREEMENT_VERSION}; client ${userId}; checkout for milestone ${milestone.id}.`})`;
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://push2startstudio.com").replace(/\/$/, "");
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    integration_identifier: "push2start_checkout_qjrmvtxa",
    customer_email: String(milestone.client_email),
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Number(milestone.amount_cents),
        product_data: { name: `push2Start — ${milestone.label}`, description: String(milestone.business_name) },
      },
    }],
    metadata: { projectId: String(milestone.project_id), milestoneId: String(milestone.id), clerkUserId: userId, agreementVersion: AGREEMENT_VERSION },
    custom_text: { submit: { message: `Opening deposit: 50%; direction approval: 25%; before launch: 25%. Review your [build agreement PDF](${origin}${AGREEMENT_PDF}).` } },
    success_url: `${origin}/client/payment-return?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/client/payment-return?status=cancelled`,
  }, { idempotencyKey: `push2start-milestone-${milestone.id}-${AGREEMENT_VERSION}` });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}
