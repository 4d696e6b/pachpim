"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteNote } from "@/features/notes/actions";

export function NoteRowActions({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-1">
      <Button asChild aria-label={`Edit ${title}`} size="icon" variant="ghost">
        <Link href={`/admin/notes/${id}`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <ConfirmDialog
        description="This permanently removes the note and releases its URL slug."
        onConfirm={() =>
          startTransition(async () => {
            try {
              await deleteNote(id);
              toast.success("Note deleted.");
            } catch {
              toast.error("Note could not be deleted.");
            }
          })
        }
        title={`Delete ${title}?`}
        trigger={
          <Button
            aria-label={`Delete ${title}`}
            disabled={pending}
            size="icon"
            variant="ghost"
          >
            <Trash2 className="text-destructive size-4" />
          </Button>
        }
      />
    </div>
  );
}
