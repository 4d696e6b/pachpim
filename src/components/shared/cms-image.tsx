"use client";

import { doc, getDoc } from "firebase/firestore";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

import { getFirebaseFirestore } from "@/lib/firebase/client";
import { cmsMediaPath, mediaIdFromUrl } from "@/lib/media";

export function CmsImage({ src, unoptimized, alt, ...props }: ImageProps) {
  const mediaPath =
    typeof src === "string"
      ? (cmsMediaPath(src) ?? (src.startsWith("/api/media/") ? src : null))
      : null;

  if (mediaPath) {
    return <FirestoreMediaImage {...props} alt={alt} src={mediaPath} />;
  }

  const bypass = typeof src === "string" && src.startsWith("/");
  return (
    <Image {...props} alt={alt} src={src} unoptimized={unoptimized ?? bypass} />
  );
}

function FirestoreMediaImage({
  src,
  alt,
  ...props
}: ImageProps & { src: string }) {
  const [state, setState] = useState<{
    source: string;
    resolved?: string;
    failed?: boolean;
  }>({ source: "" });

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    async function resolve() {
      const id = mediaIdFromUrl(src);
      const bytes = id
        ? await readPublicMediaBytes(id)
        : await readMediaJson(src);
      if (!bytes || cancelled) {
        if (!cancelled) setState({ source: src, failed: true });
        return;
      }
      objectUrl = URL.createObjectURL(
        new Blob([Uint8Array.from(bytes.data)], { type: bytes.contentType }),
      );
      setState({ source: src, resolved: objectUrl });
    }

    resolve().catch(() => {
      if (!cancelled) setState({ source: src, failed: true });
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (state.source === src && state.failed) {
    return (
      <div
        aria-label={`${String(alt || "Image")} unavailable`}
        className="bg-muted text-muted-foreground absolute inset-0 grid place-items-center p-6 text-center text-sm"
        role="img"
      >
        Image unavailable
      </div>
    );
  }

  if (state.source !== src || !state.resolved) {
    return (
      <div aria-hidden className="bg-muted absolute inset-0 animate-pulse" />
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setState({ source: src, failed: true })}
      src={state.resolved}
      unoptimized
    />
  );
}

async function readPublicMediaBytes(id: string) {
  const snapshot = await getDoc(doc(getFirebaseFirestore(), "media", id));
  if (!snapshot.exists()) return readMediaJson(`/api/media/${id}/file`);
  const data = snapshot.data();
  if (data.visibility !== "public" || data.status !== "published") {
    return null;
  }
  const raw = data.bytes as
    { toUint8Array?: () => Uint8Array } | Uint8Array | Blob | undefined;
  let bytes: Uint8Array | null = null;
  if (raw && typeof raw === "object" && "toUint8Array" in raw) {
    bytes = raw.toUint8Array?.() ?? null;
  } else if (raw instanceof Uint8Array) {
    bytes = raw;
  } else if (typeof Blob !== "undefined" && raw instanceof Blob) {
    bytes = new Uint8Array(await raw.arrayBuffer());
  }
  if (!bytes?.length) return readMediaJson(`/api/media/${id}/file`);
  return {
    contentType: String(data.contentType ?? "image/jpeg"),
    data: bytes,
  };
}

async function readMediaJson(src: string) {
  const response = await fetch(src, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as {
    contentType?: string;
    base64?: string;
  };
  if (!payload.base64) return null;
  return {
    contentType: payload.contentType ?? "image/jpeg",
    data: Uint8Array.from(atob(payload.base64), (char) => char.charCodeAt(0)),
  };
}
