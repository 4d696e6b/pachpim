import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminAction } from "@/lib/auth/session";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdminAction();
    const { visibility } = z
      .object({ visibility: z.enum(["public", "private"]) })
      .parse(await request.json());
    const { id } = await params;
    const reference = getAdminFirestore().collection("media").doc(id);
    const snapshot = await reference.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    await reference.update({
      visibility,
      status: visibility === "public" ? "published" : "draft",
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: admin.uid,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to update this file." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminAction();
    const { id } = await params;
    const reference = getAdminFirestore().collection("media").doc(id);
    const snapshot = await reference.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    await reference.delete();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete this file." },
      { status: 400 },
    );
  }
}
