import { NoteForm } from "@/features/notes/note-form";

export default function NewNotePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Notes</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">New note</h1>
      <p className="text-muted-foreground mt-2">
        Write in Markdown. Raw HTML is never rendered publicly.
      </p>
      <div className="mt-8">
        <NoteForm />
      </div>
    </div>
  );
}
