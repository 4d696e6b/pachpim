import { NextResponse } from "next/server";

import { getOptionalSession } from "@/lib/auth/session";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

function asBuffer(value: unknown): Buffer | null {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === "object" && value && "toUint8Array" in value) {
    return Buffer.from(
      (value as { toUint8Array: () => Uint8Array }).toUint8Array(),
    );
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const snapshot = await getAdminFirestore().collection("media").doc(id).get();
  if (!snapshot.exists) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const visibility = snapshot.get("visibility");
  const status = snapshot.get("status");
  const isPublic = visibility === "public" && status === "published";
  if (!isPublic && !(await getOptionalSession())) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const bytes = asBuffer(snapshot.get("bytes"));
  const contentType = String(
    snapshot.get("contentType") ?? "application/octet-stream",
  );
  if (!bytes) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": isPublic
        ? "public, max-age=3600, stale-while-revalidate=86400"
        : "private, no-store",
      "Content-Disposition": `inline; filename="${encodeURIComponent(String(snapshot.get("name") ?? "file"))}"`,
    },
  });
}
