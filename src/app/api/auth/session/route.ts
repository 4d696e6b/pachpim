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

function hasValidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
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
