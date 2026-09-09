"use client";

import { Copy, File, ImageIcon, Lock, Trash2, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CmsImage } from "@/components/shared/cms-image";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaUploader } from "@/features/media/media-uploader";
import { mediaFileUrl } from "@/lib/media";

export interface MediaItem {
  id: string;
  name: string;
  contentType: string;
  size: number;
  visibility: "public" | "private";
}

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const router = useRouter();

  async function updateVisibility(item: MediaItem) {
    const visibility = item.visibility === "public" ? "private" : "public";
    const response = await fetch(`/api/media/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    });
    if (!response.ok) {
      toast.error("Visibility could not be changed.");
      return;
    }
    toast.success(`File is now ${visibility}.`);
    router.refresh();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("File could not be deleted.");
      return;
    }
    toast.success("File deleted.");
    router.refresh();
  }

  async function copyUrl(item: MediaItem) {
    const url = mediaFileUrl(item.id);
    await navigator.clipboard.writeText(url);
    toast.success("File URL copied.");
  }

  return (
    <div>
      <MediaUploader onUploaded={() => router.refresh()} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {initialItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              {item.contentType.startsWith("image/") ? (
                <div className="bg-muted relative mb-5 aspect-video overflow-hidden rounded-xl">
                  <CmsImage
                    alt={`Preview of ${item.name}`}
                    className="object-cover"
                    fill
                    sizes="360px"
                    src={mediaFileUrl(item.id)}
                  />
                </div>
              ) : null}
              <div className="flex items-start gap-4">
                <div className="bg-muted text-muted-foreground grid size-12 shrink-0 place-items-center rounded-xl">
                  {item.contentType.startsWith("image/") ? (
                    <ImageIcon className="size-5" />
                  ) : (
                    <File className="size-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {(item.size / 1024).toFixed(0)} KB · {item.visibility}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  onClick={() => updateVisibility(item)}
                  size="sm"
                  variant="outline"
                >
                  {item.visibility === "public" ? (
                    <Lock className="size-3.5" />
                  ) : (
                    <Unlock className="size-3.5" />
                  )}
                  Make {item.visibility === "public" ? "private" : "public"}
                </Button>
                {item.visibility === "public" ? (
                  <Button
                    onClick={() => copyUrl(item)}
                    size="icon"
                    variant="ghost"
                  >
                    <Copy className="size-4" />
                    <span className="sr-only">Copy public URL</span>
                  </Button>
                ) : null}
                <ConfirmDialog
                  description="This permanently removes the file from Firestore."
                  onConfirm={() => remove(item.id)}
                  title={`Delete ${item.name}?`}
                  trigger={
                    <Button
                      aria-label={`Delete ${item.name}`}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
