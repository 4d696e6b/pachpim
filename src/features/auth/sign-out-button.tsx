"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      await getFirebaseAuth().signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
      setPending(false);
    }
  }

  return (
    <Button disabled={pending} onClick={signOut} size="sm" variant="ghost">
      <LogOut className="size-4" />
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
