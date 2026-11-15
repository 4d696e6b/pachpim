export type CursorRole = "layout" | "style" | "polish";

export type CursorPersonality = {
  speed: number;
  start: number;
  bendX: number;
  bendY: number;
  hesitation: number;
  assemblySpeed: number;
  assemblyDelay: number;
};

const roleRanges: Record<
  CursorRole,
  { speed: readonly [number, number]; start: readonly [number, number] }
> = {
  layout: { speed: [0.66, 0.75], start: [0, 0.03] },
  style: { speed: [0.7, 0.79], start: [0.12, 0.18] },
  polish: { speed: [0.54, 0.61], start: [0.3, 0.36] },
};

function unit(seed: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  // Avalanche the hash so nearby labels do not yield nearly identical motion.
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 0xffffffff;
}

function between(seed: string, minimum: number, maximum: number) {
  return minimum + unit(seed) * (maximum - minimum);
}

export function getCursorPersonality(
  seed: string,
  role: CursorRole,
): CursorPersonality {
  const ranges = roleRanges[role];
  const roleSeed = `${seed}:${role}`;
  const start = between(`${roleSeed}:start`, ...ranges.start);
  const speed = Math.min(
    between(`${roleSeed}:speed`, ...ranges.speed),
    0.98 - start,
  );

  return {
    speed,
    start,
    bendX: between(`${roleSeed}:bend-x`, -5, 5),
    bendY: between(`${roleSeed}:bend-y`, -4, 4),
    hesitation: between(`${roleSeed}:hesitation`, 0.03, 0.07),
    // Assembly belongs to the component, so it stays consistent for its roles.
    assemblySpeed: between(`${seed}:assembly-speed`, 0.9, 1.15),
    assemblyDelay: between(`${seed}:assembly-delay`, 0, 0.1),
  };
}
