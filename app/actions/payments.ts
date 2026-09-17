"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkConfigured } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { getPayableMilestone } from "@/lib/client-workspace";
import { getStripe } from "@/lib/stripe";

export async function createMilestoneCheckout(formData: FormData) {
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

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: String(milestone.client_email),
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Number(milestone.amount_cents),
        product_data: { name: `push2Start — ${milestone.label}`, description: String(milestone.business_name) },
      },
    }],
    metadata: { projectId: String(milestone.project_id), milestoneId: String(milestone.id), clerkUserId: userId },
    success_url: `${origin}/client/payment-return?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/client/payment-return?status=cancelled`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}
