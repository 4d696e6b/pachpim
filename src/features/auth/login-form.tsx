"use client";

import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  type UserCredential,
} from "firebase/auth";
import { ArrowRight, Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/form-controls";
import { getFirebaseAuth } from "@/lib/firebase/client";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type Values = z.infer<typeof schema>;

function friendlyError(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "unknown";
  if (code.includes("invalid-credential"))
    return "The email or password is incorrect.";
  if (code.includes("popup-closed")) return "Google sign-in was cancelled.";
  if (code.includes("too-many-requests"))
    return "Too many attempts. Please try again later.";
  return "Sign-in failed. Check your details and try again.";
}

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function createSession(credential: UserCredential) {
    const idToken = await credential.user.getIdToken(true);
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(body?.error ?? "This account is not authorized.");
    }
    router.replace("/admin");
    router.refresh();
  }

  async function onSubmit(values: Values) {
    setPending(true);
    setServerError("");
    try {
      await createSession(
        await signInWithEmailAndPassword(
          getFirebaseAuth(),
          values.email,
          values.password,
        ),
      );
    } catch (error) {
      setServerError(
        error instanceof Error && !("code" in error)
          ? error.message
          : friendlyError(error),
      );
      setPending(false);
    }
  }

  async function signInWithGoogle() {
    setPending(true);
    setServerError("");
    try {
      await createSession(
        await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider()),
      );
    } catch (error) {
      setServerError(
        error instanceof Error && !("code" in error)
          ? error.message
          : friendlyError(error),
      );
      setPending(false);
    }
  }

  return (
    <div>
      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            autoComplete="email"
            id="email"
            placeholder="you@example.com"
            type="email"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="current-password"
            id="password"
            type="password"
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>
        {serverError ? (
          <p
            className="bg-destructive/10 text-destructive rounded-xl p-3 text-sm"
            role="alert"
          >
            {serverError}
          </p>
        ) : null}
        <Button
          className="w-full"
          disabled={pending}
          type="submit"
          variant="accent"
        >
          {pending ? "Verifying…" : "Continue securely"}
          <ArrowRight className="size-4" />
        </Button>
      </form>
      {process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH !== "false" ? (
        <>
          <div className="text-muted-foreground my-6 flex items-center gap-3 text-xs">
            <span className="bg-border h-px flex-1" />
            or
            <span className="bg-border h-px flex-1" />
          </div>
          <Button
            className="w-full"
            disabled={pending}
            onClick={signInWithGoogle}
            variant="outline"
          >
            <Globe2 className="size-4" />
            Continue with Google
          </Button>
        </>
      ) : null}
    </div>
  );
}
