import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container grid min-h-[70vh] place-items-center py-20">
      <div className="max-w-lg text-center">
        <p className="eyebrow">404 · Not found</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          This page moved on.
        </h1>
        <p className="text-muted-foreground mt-5 leading-7">
          The page may have been unpublished, renamed, or never existed.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </Button>
      </div>
    </main>
  );
}
