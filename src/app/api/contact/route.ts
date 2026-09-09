import { createHash } from "node:crypto";

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminFirestore } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(20).max(5000),
  company: z.string().max(200).optional(),
});

function rateLimitKey(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const secret =
    process.env.RATE_LIMIT_SECRET ??
    (process.env.NODE_ENV === "development" ? "dev" : "");
  if (!secret) throw new Error("Rate limiting is not configured.");
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}

async function consumeRateLimit(key: string) {
  const db = getAdminFirestore();
  const reference = db.collection("rateLimits").doc(`contact-${key}`);
  const now = Timestamp.now();
  const windowMs = 60 * 60 * 1000;
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const data = snapshot.data() as
      { count?: number; windowStart?: Timestamp } | undefined;
    const expired =
      !data?.windowStart ||
      now.toMillis() - data.windowStart.toMillis() >= windowMs;
    const count = expired ? 0 : (data?.count ?? 0);
    if (count >= 5) return false;
    transaction.set(
      reference,
      {
        id: reference.id,
        count: count + 1,
        windowStart: expired ? now : data?.windowStart,
        createdAt: expired ? now : (snapshot.get("createdAt") ?? now),
        createdBy: "system:contact-rate-limit",
        updatedAt: now,
        updatedBy: "system:contact-rate-limit",
        expiresAt: Timestamp.fromMillis(now.toMillis() + windowMs * 2),
      },
      { merge: true },
    );
    return true;
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    if (payload.company) return NextResponse.json({ ok: true });
    if (!(await consumeRateLimit(rateLimitKey(request)))) {
      return NextResponse.json(
        { message: "Too many messages. Please try again in about an hour." },
        { status: 429 },
      );
    }

    const reference = getAdminFirestore().collection("messages").doc();
    const now = FieldValue.serverTimestamp();
    await reference.set({
      id: reference.id,
      name: payload.name,
      email: payload.email.toLowerCase(),
      subject: payload.subject,
      message: payload.message,
      status: "unread",
      createdBy: "public",
      updatedBy: "public",
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Please check the form and try again." },
        { status: 400 },
      );
    }
    console.error("Contact submission failed", error);
    return NextResponse.json(
      { message: "The message service is temporarily unavailable." },
      { status: 500 },
    );
  }
}
