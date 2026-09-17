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
        UPDATE payment_milestones
        SET status = 'paid', paid_at = now(), stripe_session_id = ${session.id}
        WHERE id = ${milestoneId} AND project_id = ${projectId} AND status <> 'paid'
      `;
      await sql`
        UPDATE payment_milestones
        SET status = 'due'
        WHERE id = (
          SELECT id FROM payment_milestones
          WHERE project_id = ${projectId} AND status = 'upcoming'
          ORDER BY sort_order LIMIT 1
        )
      `;
    }
  }

  return NextResponse.json({ received: true });
}
