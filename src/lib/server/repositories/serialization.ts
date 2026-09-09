import { Timestamp } from "firebase-admin/firestore";

type FirestoreSerializable =
  | null
  | string
  | number
  | boolean
  | Date
  | Timestamp
  | FirestoreSerializable[]
  | { [key: string]: FirestoreSerializable | undefined };

export function toFirestoreData<T extends object>(
  value: T,
): Record<string, unknown> {
  return transformForWrite(value) as Record<string, unknown>;
}

function transformForWrite(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (value instanceof Timestamp) return value;
  if (value instanceof Date) return Timestamp.fromDate(value);
  if (Array.isArray(value)) return value.map(transformForWrite);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([key, child]) => [key, transformForWrite(child)]),
    );
  }
  return value as FirestoreSerializable;
}

export function toDTO<T>(value: unknown): T {
  return transformForDTO(value) as T;
}

function transformForDTO(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(transformForDTO);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        transformForDTO(child),
      ]),
    );
  }
  return value;
}
