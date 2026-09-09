import { NextResponse } from "next/server";

import {
  fetchFirestoreDocument,
  firestoreBytesBase64,
  firestoreString,
} from "@/lib/server/firestore-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || id.includes("/")) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const document = await fetchFirestoreDocument(`media/${id}`);
    const fields = document?.fields;
    if (!fields) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const isPublic =
      firestoreString(fields, "visibility") === "public" &&
      firestoreString(fields, "status") === "published";
    const base64 = firestoreBytesBase64(fields, "bytes");
    if (!isPublic || !base64) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({
      contentType:
        firestoreString(fields, "contentType") || "application/octet-stream",
      base64,
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
