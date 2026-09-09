import {
  Timestamp,
  type DocumentData,
  type Query,
} from "firebase-admin/firestore";

import { adminDb } from "@/lib/server/firebase-admin";
import type { NoteDTO, NoteInput, ProjectDTO, ProjectInput } from "@/types";

import {
  COLLECTIONS,
  type CollectionDTOMap,
  type CollectionInputMap,
  type CollectionName,
  type SluggedCollection,
} from "./collections";
import { toDTO, toFirestoreData } from "./serialization";

type NonSluggedCollection = Exclude<CollectionName, SluggedCollection>;

export class SlugConflictError extends Error {
  constructor(slug: string) {
    super(`The slug "${slug}" is already in use.`);
    this.name = "SlugConflictError";
  }
}

export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function queryMany<T>(query: Query<DocumentData>): Promise<T[]> {
  const snapshot = await query.get();
  return snapshot.docs.map((document) =>
    toDTO<T>({ ...document.data(), id: document.id }),
  );
}

async function createSlugged<C extends SluggedCollection>(
  collection: C,
  input: CollectionInputMap[C],
  actorId: string,
  requestedId?: string,
): Promise<CollectionDTOMap[C]> {
  const reference = requestedId
    ? adminDb.collection(collection).doc(requestedId)
    : adminDb.collection(collection).doc();
  const slug = normalizeSlug(input.slug);
  if (!slug) throw new Error("A non-empty slug is required.");

  const registryReference = adminDb
    .collection(COLLECTIONS.slugRegistry)
    .doc(slug);
  const now = Timestamp.now();
  await adminDb.runTransaction(async (transaction) => {
    const [entity, registry] = await Promise.all([
      transaction.get(reference),
      transaction.get(registryReference),
    ]);
    if (entity.exists)
      throw new Error(`${collection}/${reference.id} already exists.`);
    if (registry.exists) throw new SlugConflictError(slug);

    transaction.create(
      registryReference,
      toFirestoreData({
        slug,
        collection,
        entityId: reference.id,
        createdAt: now,
      }),
    );
    transaction.create(
      reference,
      toFirestoreData({
        ...input,
        id: reference.id,
        slug,
        createdAt: now,
        updatedAt: now,
        createdBy: actorId,
        updatedBy: actorId,
      }),
    );
  });

  const created = await reference.get();
  return toDTO<CollectionDTOMap[C]>({ ...created.data(), id: created.id });
}

async function upsertSlugged<C extends SluggedCollection>(
  collection: C,
  id: string,
  input: CollectionInputMap[C],
  actorId: string,
): Promise<CollectionDTOMap[C]> {
  const reference = adminDb.collection(collection).doc(id);
  const slug = normalizeSlug(input.slug);
  if (!slug) throw new Error("A non-empty slug is required.");

  const newRegistryReference = adminDb
    .collection(COLLECTIONS.slugRegistry)
    .doc(slug);
  const now = Timestamp.now();

  await adminDb.runTransaction(async (transaction) => {
    const entity = await transaction.get(reference);
    const previousSlug =
      entity.exists && typeof entity.get("slug") === "string"
        ? normalizeSlug(entity.get("slug") as string)
        : null;
    const newRegistry = await transaction.get(newRegistryReference);
    const previousRegistryReference =
      previousSlug && previousSlug !== slug
        ? adminDb.collection(COLLECTIONS.slugRegistry).doc(previousSlug)
        : null;
    const previousRegistry = previousRegistryReference
      ? await transaction.get(previousRegistryReference)
      : null;

    if (
      newRegistry.exists &&
      (newRegistry.get("collection") !== collection ||
        newRegistry.get("entityId") !== id)
    ) {
      throw new SlugConflictError(slug);
    }
    if (
      previousRegistry?.exists &&
      (previousRegistry.get("collection") !== collection ||
        previousRegistry.get("entityId") !== id)
    ) {
      throw new Error(
        `Slug registry ownership mismatch for "${previousSlug}".`,
      );
    }

    if (previousRegistryReference)
      transaction.delete(previousRegistryReference);
    transaction.set(
      newRegistryReference,
      toFirestoreData({
        slug,
        collection,
        entityId: id,
        createdAt: newRegistry.get("createdAt") ?? now,
      }),
    );
    transaction.set(
      reference,
      toFirestoreData({
        ...input,
        id,
        slug,
        createdAt: entity.get("createdAt") ?? now,
        updatedAt: now,
        createdBy: entity.get("createdBy") ?? actorId,
        updatedBy: actorId,
      }),
    );
  });

  const updated = await reference.get();
  return toDTO<CollectionDTOMap[C]>({ ...updated.data(), id: updated.id });
}

async function deleteSlugged(
  collection: SluggedCollection,
  id: string,
): Promise<void> {
  const reference = adminDb.collection(collection).doc(id);
  await adminDb.runTransaction(async (transaction) => {
    const entity = await transaction.get(reference);
    if (!entity.exists) return;
    const slug = entity.get("slug");
    const registryReference =
      typeof slug === "string"
        ? adminDb.collection(COLLECTIONS.slugRegistry).doc(normalizeSlug(slug))
        : null;
    const registry = registryReference
      ? await transaction.get(registryReference)
      : null;

    transaction.delete(reference);
    if (
      registryReference &&
      registry?.exists &&
      registry.get("collection") === collection &&
      registry.get("entityId") === id
    ) {
      transaction.delete(registryReference);
    }
  });
}

export const adminRepository = {
  list<C extends CollectionName>(
    collection: C,
    limit = 100,
  ): Promise<CollectionDTOMap[C][]> {
    return queryMany<CollectionDTOMap[C]>(
      adminDb
        .collection(collection)
        .orderBy("updatedAt", "desc")
        .limit(Math.min(Math.max(limit, 1), 500)),
    );
  },

  async get<C extends CollectionName>(
    collection: C,
    id: string,
  ): Promise<CollectionDTOMap[C] | null> {
    const document = await adminDb.collection(collection).doc(id).get();
    return document.exists
      ? toDTO<CollectionDTOMap[C]>({ ...document.data(), id: document.id })
      : null;
  },

  async upsert<C extends NonSluggedCollection>(
    collection: C,
    id: string,
    input: CollectionInputMap[C],
    actorId: string,
  ): Promise<CollectionDTOMap[C]> {
    const reference = adminDb.collection(collection).doc(id);
    const now = Timestamp.now();
    await adminDb.runTransaction(async (transaction) => {
      const existing = await transaction.get(reference);
      transaction.set(
        reference,
        toFirestoreData({
          ...input,
          id,
          createdAt: existing.get("createdAt") ?? now,
          updatedAt: now,
          createdBy: existing.get("createdBy") ?? actorId,
          updatedBy: actorId,
        }),
      );
    });
    const saved = await reference.get();
    return toDTO<CollectionDTOMap[C]>({ ...saved.data(), id: saved.id });
  },

  async update<C extends NonSluggedCollection>(
    collection: C,
    id: string,
    input: Partial<CollectionInputMap[C]>,
    actorId: string,
  ): Promise<void> {
    await adminDb
      .collection(collection)
      .doc(id)
      .update(
        toFirestoreData({
          ...input,
          updatedAt: Timestamp.now(),
          updatedBy: actorId,
        }),
      );
  },

  async delete(collection: NonSluggedCollection, id: string): Promise<void> {
    await adminDb.collection(collection).doc(id).delete();
  },

  createProject(
    input: ProjectInput,
    actorId: string,
    id?: string,
  ): Promise<ProjectDTO> {
    return createSlugged("projects", input, actorId, id);
  },

  upsertProject(
    id: string,
    input: ProjectInput,
    actorId: string,
  ): Promise<ProjectDTO> {
    return upsertSlugged("projects", id, input, actorId);
  },

  deleteProject(id: string): Promise<void> {
    return deleteSlugged("projects", id);
  },

  createNote(input: NoteInput, actorId: string, id?: string): Promise<NoteDTO> {
    return createSlugged("notes", input, actorId, id);
  },

  upsertNote(id: string, input: NoteInput, actorId: string): Promise<NoteDTO> {
    return upsertSlugged("notes", id, input, actorId);
  },

  deleteNote(id: string): Promise<void> {
    return deleteSlugged("notes", id);
  },
};
