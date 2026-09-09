import { FileText, Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/form-controls";
import { NoteRowActions } from "@/features/notes/note-row-actions";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export default async function AdminNotesPage() {
  const snapshot = await getAdminFirestore()
    .collection("notes")
    .orderBy("updatedAt", "desc")
    .get();
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Publishing</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-2">
            Write in Markdown, preview, and publish when ready.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/notes/new">
            <Plus className="size-4" /> New note
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        {!snapshot.empty ? (
          <div className="grid gap-3">
            {snapshot.docs.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-semibold">
                        {doc.get("title")}
                      </h2>
                      <Badge>{doc.get("status")}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {doc.get("category")} · {doc.get("readingTime") ?? 1} min
                      read · /notes/{doc.get("slug")}
                    </p>
                  </div>
                  <NoteRowActions id={doc.id} title={doc.get("title")} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/admin/notes/new">Write first note</Link>
              </Button>
            }
            description="Draft ideas in Markdown and publish only when they are ready."
            icon={FileText}
            title="No notes yet"
          />
        )}
      </div>
    </div>
  );
}
