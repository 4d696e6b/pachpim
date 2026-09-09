import { describe, expect, it } from "vitest";

import { normalizeFirebasePrivateKey } from "@/lib/server/firebase-private-key";

const body = `${"A".repeat(64)}${"B".repeat(20)}`;
const pem = `-----BEGIN PRIVATE KEY-----\n${body.slice(0, 64)}\n${body.slice(64)}\n-----END PRIVATE KEY-----\n`;

describe("normalizeFirebasePrivateKey", () => {
  it("rebuilds PEM from a quoted one-line env value", () => {
    const raw = `"-----BEGIN PRIVATE KEY-----\\n${body}\\n-----END PRIVATE KEY-----\\n"`;
    expect(normalizeFirebasePrivateKey(raw)).toBe(pem);
  });

  it("accepts an already-unescaped multiline PEM", () => {
    expect(normalizeFirebasePrivateKey(pem)).toBe(pem);
  });

  it("wraps a PEM that lost all newlines", () => {
    expect(
      normalizeFirebasePrivateKey(
        `-----BEGIN PRIVATE KEY-----${body}-----END PRIVATE KEY-----`,
      ),
    ).toBe(pem);
  });
});
