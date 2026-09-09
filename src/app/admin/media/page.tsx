import { ImageIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { MediaLibrary, type MediaItem } from "@/features/media/media-library";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

export default async function AdminMediaPage() {
  const snapshot = await getAdminFirestore()
    .collection("media")
    .orderBy("createdAt", "desc")
    .select("name", "contentType", "size", "visibility")
    .get();
  const items = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        name: doc.get("name"),
        contentType: doc.get("contentType"),
        size: doc.get("size"),
        visibility: doc.get("visibility"),
      }) as MediaItem,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <p className="eyebrow">Assets</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Media library
      </h1>
      <p className="text-muted-foreground mt-2">
        Upload, publish, copy, and safely remove portfolio assets.
      </p>
      <div className="mt-8">
        <MediaLibrary initialItems={items} />
        {!items.length ? (
          <div className="mt-8">
            <EmptyState
              description="Upload an image or PDF above. New files stay private until you publish them."
              icon={ImageIcon}
              title="No media yet"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
