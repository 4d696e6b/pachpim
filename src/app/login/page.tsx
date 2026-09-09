import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";
import { getOptionalSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Admin sign in",
  description: "Secure administrator access.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getOptionalSession()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,var(--muted),transparent_52%)] p-4">
      <Card className="bg-card/90 w-full max-w-md backdrop-blur">
        <CardHeader className="pb-6 text-center">
          <div className="bg-accent/10 text-accent mx-auto grid size-12 place-items-center rounded-2xl">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Administrator access
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Sign in with an approved account. Public registration is disabled.
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <Link
            className="text-muted-foreground hover:text-foreground mt-6 block text-center text-sm"
            href="/"
          >
            Return to portfolio
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
