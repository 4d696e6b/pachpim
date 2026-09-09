"use client";

import { FileUp, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { MAX_MEDIA_BYTES } from "@/lib/media";

export function MediaUploader({
  onUploaded,
}: {
  onUploaded?: (id?: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  function upload(file: File) {
    if (file.size > MAX_MEDIA_BYTES) {
      toast.error("Keep files under 700 KB so they fit in Firestore.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", "/api/media");
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      setProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      xhrRef.current = null;
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        toast.success("File saved to Firestore.");
        if (inputRef.current) inputRef.current.value = "";
        const payload = (() => {
          try {
            return JSON.parse(xhr.responseText) as { id?: string };
          } catch {
            return null;
          }
        })();
        onUploaded?.(payload?.id);
        return;
      }
      const body = (() => {
        try {
          return JSON.parse(xhr.responseText) as { error?: string };
        } catch {
          return null;
        }
      })();
      toast.error(body?.error ?? "The file could not be saved.");
    };
    xhr.onerror = () => {
      xhrRef.current = null;
      setProgress(null);
      toast.error("The file could not be saved.");
    };
    xhr.onabort = () => {
      xhrRef.current = null;
      setProgress(null);
    };
    setProgress(0);
    xhr.send(formData);
  }

  return (
    <div className="border-border rounded-2xl border border-dashed p-6">
      <input
        accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
        className="sr-only"
        disabled={progress !== null}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
        ref={inputRef}
        type="file"
      />
      <div className="flex flex-col items-center text-center">
        <FileUp className="text-accent size-6" />
        <p className="mt-3 text-sm font-medium">Upload an image or document</p>
        <p className="text-muted-foreground mt-1 text-xs">
          JPG, PNG, WebP, GIF or PDF · 700 KB max · stored in Firestore
        </p>
        {progress === null ? (
          <Button
            className="mt-4"
            onClick={() => inputRef.current?.click()}
            size="sm"
            variant="outline"
          >
            Choose file
          </Button>
        ) : (
          <div className="mt-4 w-full max-w-xs">
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-accent h-full transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-muted-foreground mt-2 flex items-center justify-center gap-2 text-xs">
              {progress}% uploaded
              <button
                aria-label="Cancel upload"
                onClick={() => xhrRef.current?.abort()}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
