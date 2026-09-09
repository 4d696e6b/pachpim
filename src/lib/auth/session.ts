import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getAdminAuth } from "@/lib/server/firebase-admin";

export const SESSION_COOKIE_NAME = "__session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase().replace(/^["']+|["']+$/g, "");
}

export function allowlistedEmails() {
  const fromEnv = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
  return new Set([...siteConfig.adminEmails.map(normalizeEmail), ...fromEnv]);
}

export function adminDenialReason(token: DecodedIdToken) {
  const email = token.email?.toLowerCase();
  if (!email) {
    return "This sign-in has no email address. Use the Google account that matches your admin email.";
  }
  if (!allowlistedEmails().has(email)) {
    return `Signed in as ${email}, which is not on the admin allowlist.`;
  }
  if (token.admin !== true) {
    return "This email is allowlisted, but the Firebase admin claim is missing. Run npm run admin:grant for this email, then sign in again.";
  }
  return null;
}

export function isApprovedAdmin(token: DecodedIdToken) {
  return adminDenialReason(token) === null;
}

export async function getOptionalSession(): Promise<DecodedIdToken | null> {
  try {
    const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;
    const token = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return isApprovedAdmin(token) ? token : null;
  } catch (error) {
    unstable_rethrow(error);
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
