import { ProjectForm } from "@/features/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="eyebrow">Projects</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        New project
      </h1>
      <p className="text-muted-foreground mt-2">
        Start as a draft and publish when the story is ready.
      </p>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
