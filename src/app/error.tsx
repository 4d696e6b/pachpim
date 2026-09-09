"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container grid min-h-[70vh] place-items-center py-20">
      <div className="max-w-md text-center">
        <AlertCircle className="text-destructive mx-auto size-8" />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mt-3 leading-7">
          We couldn’t load this page. No changes were made. Please try again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
        {error.digest ? (
          <p className="text-muted-foreground mt-4 text-xs">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
