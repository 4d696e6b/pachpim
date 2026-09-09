import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAdminAuth } from "@/lib/server/firebase-admin";

export const SESSION_COOKIE_NAME = "__session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

function allowlistedEmails() {
  return new Set(
    (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isApprovedAdmin(token: DecodedIdToken) {
  const email = token.email?.toLowerCase();
  return (
    token.admin === true && Boolean(email && allowlistedEmails().has(email))
  );
}

export async function getOptionalSession(): Promise<DecodedIdToken | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  try {
    const token = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return isApprovedAdmin(token) ? token : null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getOptionalSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdminAction() {
  const session = await getOptionalSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
