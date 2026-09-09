import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  isApprovedAdmin,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/auth/session";
import { getAdminAuth } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

const sessionSchema = z.object({ idToken: z.string().min(100).max(10000) });

function requestHost(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-host");
  const host = (forwarded ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim();
  return host;
}

function hasValidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = requestHost(request);
  if (!origin || !host) return false;
  try {
    const originHost = new URL(origin).host;
    if (originHost === host) return true;
    const siteHost = new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ).host;
    return originHost === siteHost;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  try {
    const { idToken } = sessionSchema.parse(await request.json());
    const decoded = await getAdminAuth().verifyIdToken(idToken, true);
    if (!isApprovedAdmin(decoded)) {
      return NextResponse.json(
        { error: "This account is not approved." },
        { status: 403 },
      );
    }

    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to create a secure session." },
      { status: 401 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
