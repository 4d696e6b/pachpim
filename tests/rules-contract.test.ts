import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Firebase rules contract", () => {
  const firestore = readFileSync(
    join(process.cwd(), "firestore.rules"),
    "utf8",
  );
  const storage = readFileSync(join(process.cwd(), "storage.rules"), "utf8");

  it("requires the immutable admin custom claim", () => {
    expect(firestore).toContain("request.auth.token.admin == true");
    expect(storage).toContain("request.auth.token.admin == true");
  });

  it("defaults unmatched Firestore and Storage paths to denied", () => {
    expect(firestore).toContain("allow read, write: if false");
    expect(storage).toContain("allow read, write: if false");
  });

  it("gates public objects by explicit visibility", () => {
    expect(firestore).toContain("resource.data.visibility == 'public'");
    expect(storage).toContain("resource.metadata.visibility == 'public'");
  });
});
