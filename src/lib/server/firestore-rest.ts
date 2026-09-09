import { getGoogleAccessToken } from "@/lib/server/firebase-admin";

type FirestoreValue = {
  stringValue?: string;
  bytesValue?: string;
};

export async function fetchFirestoreDocument(documentPath: string) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error("Missing FIREBASE_PROJECT_ID");

  const token = await getGoogleAccessToken();
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${documentPath}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Firestore REST ${response.status}`);
  }
  return (await response.json()) as {
    fields?: Record<string, FirestoreValue>;
  };
}

export function firestoreString(
  fields: Record<string, FirestoreValue> | undefined,
  key: string,
) {
  return fields?.[key]?.stringValue ?? "";
}

export function firestoreBytesBase64(
  fields: Record<string, FirestoreValue> | undefined,
  key: string,
) {
  return fields?.[key]?.bytesValue ?? "";
}
