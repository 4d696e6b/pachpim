import { FolderKanban, Plus, Star } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/form-controls";
import { ProjectRowActions } from "@/features/projects/project-row-actions";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export default async function AdminProjectsPage() {
  const snapshot = await getAdminFirestore()
    .collection("projects")
    .orderBy("sortOrder", "asc")
    .get();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, order, feature, draft, and publish case studies.
          </p>
        </div>
        <Button asChild variant="accent">
          <Link href="/admin/projects/new">
            <Plus className="size-4" /> New project
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
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold">
                        {doc.get("title")}
                      </h2>
                      <Badge>{doc.get("status")}</Badge>
                      {doc.get("featured") ? (
                        <Star className="fill-accent text-accent size-4" />
                      ) : null}
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">
                      /projects/{doc.get("slug")} · {doc.get("category")} ·
                      order {doc.get("sortOrder") ?? 0}
                    </p>
                  </div>
                  <ProjectRowActions id={doc.id} title={doc.get("title")} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/admin/projects/new">Create first project</Link>
              </Button>
            }
            description="Create a draft, add the case study, then publish when it is ready."
            icon={FolderKanban}
            title="No projects yet"
          />
        )}
      </div>
    </div>
  );
}
