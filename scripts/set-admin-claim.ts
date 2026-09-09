#!/usr/bin/env tsx

import { loadEnvConfig } from "@next/env";

function readArgument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  loadEnvConfig(process.cwd());
  const uidArgument = readArgument("--uid");
  const emailArgument = readArgument("--email");
  const remove = process.argv.includes("--remove");

  if (Boolean(uidArgument) === Boolean(emailArgument)) {
    throw new Error(
      "Provide exactly one user selector: --uid <uid> or --email <email>.",
    );
  }

  const { adminAuth } = await import("../src/lib/server/firebase-admin");
  const user = uidArgument
    ? await adminAuth.getUser(uidArgument)
    : await adminAuth.getUserByEmail(emailArgument as string);
  const claims = { ...user.customClaims };

  if (remove) {
    delete claims.admin;
  } else {
    claims.admin = true;
  }

  await adminAuth.setCustomUserClaims(user.uid, claims);
  console.log(
    `${remove ? "Removed" : "Set"} admin claim for ${user.email ?? user.uid}. ` +
      "The user must refresh their ID token for the change to take effect.",
  );
}

main().catch((error: unknown) => {
  console.error("Unable to update admin claim:", error);
  process.exitCode = 1;
});
