import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const milestoneId = session.metadata?.milestoneId;
    const projectId = session.metadata?.projectId;
    if (milestoneId && projectId && session.payment_status === "paid") {
      const sql = getSql();
      await sql`
        WITH claimed AS (
          INSERT INTO stripe_webhook_events (event_id, event_type)
          VALUES (${event.id}, ${event.type})
          ON CONFLICT (event_id) DO NOTHING
          RETURNING event_id
        ), paid AS (
          UPDATE payment_milestones
          SET status = 'paid',
              paid_at = COALESCE(paid_at, now()),
              stripe_session_id = ${session.id},
              stripe_payment_intent_id = ${typeof session.payment_intent === "string" ? session.payment_intent : null}
          WHERE id = ${milestoneId}
            AND project_id = ${projectId}
            AND EXISTS (SELECT 1 FROM claimed)
          RETURNING project_id
        ), customer_updated AS (
          UPDATE client_projects
          SET stripe_customer_id = COALESCE(stripe_customer_id, ${typeof session.customer === "string" ? session.customer : null})
          WHERE id = ${projectId} AND EXISTS (SELECT 1 FROM claimed)
          RETURNING id
        )
        UPDATE payment_milestones
        SET status = 'due'
        WHERE id = (
          SELECT id FROM payment_milestones
          WHERE project_id = ${projectId} AND status = 'upcoming'
          ORDER BY sort_order LIMIT 1
        )
        AND EXISTS (SELECT 1 FROM paid)
      `;
    }
  }

  return NextResponse.json({ received: true });
}
