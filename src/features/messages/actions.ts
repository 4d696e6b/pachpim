"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { requireAdminAction } from "@/lib/auth/session";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export async function updateMessageStatus(
  id: string,
  status: "read" | "archived",
) {
  const admin = await requireAdminAction();
  await getAdminFirestore().collection("messages").doc(id).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: admin.uid,
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdminAction();
  await getAdminFirestore().collection("messages").doc(id).delete();
  revalidatePath("/admin/messages");
}
