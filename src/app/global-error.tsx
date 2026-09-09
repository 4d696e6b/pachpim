"use client";

import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground grid min-h-screen place-items-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="text-destructive mx-auto size-8" />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            This page couldn’t load
          </h1>
          <p className="text-muted-foreground mt-3 leading-7">
            A server error occurred. Reload to try again.
          </p>
          <button
            className="bg-foreground text-background mt-6 rounded-full px-5 py-2.5 text-sm font-medium"
            onClick={reset}
            type="button"
          >
            Reload
          </button>
          {error.digest ? (
            <p className="text-muted-foreground mt-4 text-xs">
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
