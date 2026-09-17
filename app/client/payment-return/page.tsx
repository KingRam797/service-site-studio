import Link from "next/link";

export default async function PaymentReturn({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const paid = status === "success";
  return (
    <main className="workspace-shell workspace-centered">
      <section className="workspace-empty">
        <span className="workspace-kicker">{paid ? "PAYMENT RECEIVED" : "CHECKOUT CLOSED"}</span>
        <h1>{paid ? "That milestone is cleared." : "No payment was made."}</h1>
        <p>{paid ? "Stripe is confirming the payment now. Your workspace will update as soon as the signed confirmation arrives." : "Your milestone remains available whenever you are ready."}</p>
        <Link href="/client">Return to workspace</Link>
      </section>
    </main>
  );
}
