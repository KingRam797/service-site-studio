import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { clerkConfigured } from "@/lib/auth";

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <Link href="/" className="auth-brand">push<span>2</span>Start</Link>
      {clerkConfigured ? (
        <SignIn path="/sign-in" routing="path" forceRedirectUrl="/client" />
      ) : (
        <section className="auth-notice">
          <p>CLIENT ACCESS</p>
          <h1>The client workspace is ready to connect.</h1>
          <span>Secure sign-in becomes active when the Clerk keys are added to the production environment.</span>
          <Link href="/#start">Request a build review</Link>
        </section>
      )}
    </main>
  );
}
