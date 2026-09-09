import {
  FileText,
  FolderKanban,
  HardDrive,
  MessageSquare,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

async function getDashboardStats() {
  const db = getAdminFirestore();
  const [
    projects,
    publishedProjects,
    notes,
    publishedNotes,
    messages,
    media,
    recentProjects,
    recentNotes,
  ] = await Promise.all([
    db.collection("projects").count().get(),
    db.collection("projects").where("status", "==", "published").count().get(),
    db.collection("notes").count().get(),
    db.collection("notes").where("status", "==", "published").count().get(),
    db.collection("messages").where("status", "==", "unread").count().get(),
    db.collection("media").select("size").get(),
    db.collection("projects").orderBy("updatedAt", "desc").limit(3).get(),
    db.collection("notes").orderBy("updatedAt", "desc").limit(3).get(),
  ]);
  return {
    projects: projects.data().count,
    publishedProjects: publishedProjects.data().count,
    notes: notes.data().count,
    publishedNotes: publishedNotes.data().count,
    unreadMessages: messages.data().count,
    storageBytes: media.docs.reduce(
      (sum, doc) => sum + Number(doc.data().size ?? 0),
      0,
    ),
    recent: [
      ...recentProjects.docs.map((doc) => ({
        id: doc.id,
        title: String(doc.get("title")),
        kind: "Project",
        updatedAt: doc.get("updatedAt")?.toMillis?.() ?? 0,
      })),
      ...recentNotes.docs.map((doc) => ({
        id: doc.id,
        title: String(doc.get("title")),
        kind: "Note",
        updatedAt: doc.get("updatedAt")?.toMillis?.() ?? 0,
      })),
    ]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5),
  };
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const cards = [
    {
      label: "Projects",
      value: stats.projects,
      detail: `${stats.publishedProjects} published`,
      icon: FolderKanban,
    },
    {
      label: "Notes",
      value: stats.notes,
      detail: `${stats.publishedNotes} published`,
      icon: FileText,
    },
    {
      label: "Unread messages",
      value: stats.unreadMessages,
      detail: "Needs attention",
      icon: MessageSquare,
    },
    {
      label: "Media in Firestore",
      value: formatBytes(stats.storageBytes),
      detail: "Images and documents stored as documents",
      icon: HardDrive,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Good to see you.
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage what the world sees from one place.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/notes/new">
              <Plus className="size-4" />
              New note
            </Link>
          </Button>
          <Button asChild variant="accent">
            <Link href="/admin/projects/new">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm">
                {label}
              </CardTitle>
              <Icon className="text-accent size-4" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
              <p className="text-muted-foreground mt-2 text-xs">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Edit profile", "/admin/profile"],
            ["Organize media", "/admin/media"],
            ["Review messages", "/admin/messages"],
            ["View live site", "/"],
          ].map(([label, href]) => (
            <Button asChild key={href} variant="outline">
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent updates</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recent.length ? (
            <div className="divide-y">
              {stats.recent.map((item) => (
                <div
                  className="flex items-center justify-between gap-4 py-3"
                  key={`${item.kind}-${item.id}`}
                >
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <span className="text-muted-foreground text-xs">
                    {item.kind}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Updates will appear after you create content.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
