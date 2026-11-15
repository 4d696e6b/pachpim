import { describe, expect, it } from "vitest";

import {
  getCursorPersonality,
  type CursorRole,
} from "@/lib/cursor-personality";

const roles: CursorRole[] = ["layout", "style", "polish"];

describe("getCursorPersonality", () => {
  it("is repeatable without randomness or clock input", () => {
    expect(getCursorPersonality("Project / RepoSetup", "layout")).toEqual(
      getCursorPersonality("Project / RepoSetup", "layout"),
    );
  });

  it("gives different components distinct paths and assembly timing", () => {
    const first = getCursorPersonality("Project / RepoSetup", "style");
    const second = getCursorPersonality("Project / Luxios", "style");
    expect(first).not.toEqual(second);
    expect(first.bendX).not.toBe(second.bendX);
    expect(first.assemblyDelay).not.toBe(second.assemblyDelay);
  });

  it("keeps component assembly timing identical across collaborator roles", () => {
    const profiles = roles.map((role) => getCursorPersonality("Heading", role));
    expect(new Set(profiles.map((profile) => profile.assemblySpeed)).size).toBe(
      1,
    );
    expect(new Set(profiles.map((profile) => profile.assemblyDelay)).size).toBe(
      1,
    );
  });

  it("uses each role's start and duration ranges", () => {
    const profiles = Object.fromEntries(
      roles.map((role) => [role, getCursorPersonality("Introduction", role)]),
    );
    expect(profiles.layout.start).toBeGreaterThanOrEqual(0);
    expect(profiles.layout.start).toBeLessThanOrEqual(0.03);
    expect(profiles.layout.speed).toBeGreaterThanOrEqual(0.66);
    expect(profiles.layout.speed).toBeLessThanOrEqual(0.75);
    expect(profiles.style.start).toBeGreaterThanOrEqual(0.12);
    expect(profiles.style.start).toBeLessThanOrEqual(0.18);
    expect(profiles.style.speed).toBeGreaterThanOrEqual(0.7);
    expect(profiles.style.speed).toBeLessThanOrEqual(0.79);
    expect(profiles.polish.start).toBeGreaterThanOrEqual(0.3);
    expect(profiles.polish.start).toBeLessThanOrEqual(0.36);
    expect(profiles.polish.speed).toBeGreaterThanOrEqual(0.54);
    expect(profiles.polish.speed).toBeLessThanOrEqual(0.61);
  });

  it("keeps all pauses, paths, and completion times within safe bounds", () => {
    for (const seed of [
      "",
      "Heading",
      "👋 Profile",
      "a".repeat(200),
      "Gallery",
    ]) {
      for (const role of roles) {
        const profile = getCursorPersonality(seed, role);
        expect(profile.start + profile.speed).toBeLessThanOrEqual(0.98);
        expect(profile.bendX).toBeGreaterThanOrEqual(-5);
        expect(profile.bendX).toBeLessThanOrEqual(5);
        expect(profile.bendY).toBeGreaterThanOrEqual(-4);
        expect(profile.bendY).toBeLessThanOrEqual(4);
        expect(profile.hesitation).toBeGreaterThanOrEqual(0.03);
        expect(profile.hesitation).toBeLessThanOrEqual(0.07);
        expect(profile.assemblySpeed).toBeGreaterThanOrEqual(0.9);
        expect(profile.assemblySpeed).toBeLessThanOrEqual(1.15);
        expect(profile.assemblyDelay).toBeGreaterThanOrEqual(0);
        expect(profile.assemblyDelay).toBeLessThanOrEqual(0.1);
        expect(Object.values(profile).every(Number.isFinite)).toBe(true);
      }
    }
  });
});
