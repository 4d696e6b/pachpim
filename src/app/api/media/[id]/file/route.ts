import { NextResponse } from "next/server";

import { getAdminFirestore } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asBuffer(value: unknown): Buffer | null {
  if (!value) return null;
  if (Buffer.isBuffer(value)) return Buffer.from(value);
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === "string") {
    const payload = value.includes(",")
      ? value.slice(value.indexOf(",") + 1)
      : value;
    const decoded = Buffer.from(payload, "base64");
    return decoded.length ? decoded : null;
  }
  if (typeof value === "object") {
    const record = value as {
      toUint8Array?: () => Uint8Array;
      toBase64?: () => string;
      data?: unknown;
    };
    if (typeof record.toUint8Array === "function") {
      return Buffer.from(record.toUint8Array());
    }
    if (typeof record.toBase64 === "function") {
      return Buffer.from(record.toBase64(), "base64");
    }
    if (Array.isArray(record.data)) {
      return Buffer.from(record.data as number[]);
    }
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || id.includes("/")) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const snapshot = await getAdminFirestore().collection("media").doc(id).get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const isPublic =
      snapshot.get("visibility") === "public" &&
      snapshot.get("status") === "published";
    if (!isPublic) {
      const { getOptionalSession } = await import("@/lib/auth/session");
      if (!(await getOptionalSession())) {
        return NextResponse.json({ error: "Not found." }, { status: 404 });
      }
    }

    const bytes = asBuffer(snapshot.get("bytes"));
    const contentType = String(
      snapshot.get("contentType") ?? "application/octet-stream",
    );
    if (!bytes?.length) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return new Response(bytes, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": isPublic
          ? "public, max-age=3600, stale-while-revalidate=86400"
          : "private, no-store",
      },
    });
  } catch (error) {
    console.error(
      "media file failed",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "The file could not be loaded." },
      { status: 500 },
    );
  }
}
