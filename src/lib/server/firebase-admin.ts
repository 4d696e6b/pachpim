import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

import { normalizeFirebasePrivateKey } from "@/lib/server/firebase-private-key";

let app: App | undefined;

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server environment variable: ${name}`);
  return value;
}

export function getAdminApp() {
  if (app) return app;
  if (getApps().length) {
    app = getApp();
    return app;
  }
  app = initializeApp({
    credential: cert({
      projectId: required("FIREBASE_PROJECT_ID"),
      clientEmail: required("FIREBASE_CLIENT_EMAIL"),
      privateKey: normalizeFirebasePrivateKey(required("FIREBASE_PRIVATE_KEY")),
    }),
  });
  return app;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

function lazyProxy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const target = factory();
      const value = Reflect.get(target, property, target) as unknown;
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

// Backward-compatible lazy exports for repositories. Initialization still happens only on use.
export const adminAuth: Auth = lazyProxy(getAdminAuth);
export const adminDb: Firestore = lazyProxy(getAdminFirestore);
