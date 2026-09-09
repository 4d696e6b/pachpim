import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { requireAdminAction } from "@/lib/auth/session";
import { isAcceptedMediaType, MAX_MEDIA_BYTES } from "@/lib/media";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminAction();
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Choose a file to upload." },
        { status: 400 },
      );
    }
    if (!isAcceptedMediaType(file.type) || file.size > MAX_MEDIA_BYTES) {
      return NextResponse.json(
        {
          error: `Use a JPG, PNG, WebP, GIF, or PDF up to ${Math.floor(MAX_MEDIA_BYTES / 1024)} KB.`,
        },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const reference = getAdminFirestore().collection("media").doc();
    const now = FieldValue.serverTimestamp();
    await reference.set({
      id: reference.id,
      name: file.name.slice(0, 180),
      contentType: file.type,
      size: file.size,
      bytes,
      visibility: "private",
      status: "draft",
      createdBy: admin.uid,
      updatedBy: admin.uid,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: reference.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.json(
      { error: "The file could not be saved." },
      { status: 500 },
    );
  }
}
