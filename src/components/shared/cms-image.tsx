"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

import { cmsMediaPath } from "@/lib/media";

export function CmsImage({ src, unoptimized, ...props }: ImageProps) {
  const mediaPath =
    typeof src === "string"
      ? (cmsMediaPath(src) ?? (src.startsWith("/api/media/") ? src : null))
      : null;

  if (mediaPath) {
    return <FirestoreMediaImage {...props} src={mediaPath} />;
  }

  const bypass = typeof src === "string" && src.startsWith("/");
  return <Image {...props} src={src} unoptimized={unoptimized ?? bypass} />;
}

function FirestoreMediaImage({ src, ...props }: ImageProps & { src: string }) {
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    fetch(src, { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error("media");
        const payload = (await response.json()) as {
          contentType?: string;
          base64?: string;
        };
        if (!payload.base64) throw new Error("media");
        const binary = Uint8Array.from(atob(payload.base64), (char) =>
          char.charCodeAt(0),
        );
        objectUrl = URL.createObjectURL(
          new Blob([binary], { type: payload.contentType ?? "image/jpeg" }),
        );
        if (!cancelled) setResolved(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setResolved(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!resolved) {
    return <div aria-hidden className="bg-muted absolute inset-0" />;
  }

  return <Image {...props} src={resolved} unoptimized />;
}
