import { NoteForm } from "@/features/notes/note-form";

export default function NewNotePage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <p className="eyebrow">Experience</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">New update</h1>
      <p className="text-muted-foreground mt-2">
        Share a moment with writing tools and a live preview. Save as a draft
        until you are ready to share.
      </p>
      <div className="mt-8">
        <NoteForm />
      </div>
    </div>
  );
}
