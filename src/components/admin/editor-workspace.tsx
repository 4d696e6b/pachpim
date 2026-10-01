"use client";

import { Eye, Columns2, Pencil, Smartphone, Monitor } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EditorWorkspace({
  children,
  preview,
  dirty,
  kind,
}: {
  children: React.ReactNode;
  preview: React.ReactNode;
  dirty: boolean;
  kind: string;
}) {
  const [mode, setMode] = useState("split");
  const [mobile, setMobile] = useState(false);
  return (
    <div className="grid min-w-0 gap-6">
      <div className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4">
        <div>
          <p className="eyebrow">{kind} studio</p>
          <p className="text-muted-foreground mt-1 text-xs" role="status">
            {dirty
              ? "Unsaved changes · preview updates as you edit"
              : "Your workspace is ready"}
          </p>
        </div>
        <div
          className="bg-muted flex gap-1 rounded-xl p-1"
          aria-label="Workspace view"
        >
          {[
            ["edit", "Edit", Pencil],
            ["split", "Split", Columns2],
            ["preview", "Preview", Eye],
          ].map(([value, label, Icon]) => {
            const ViewIcon = Icon as typeof Eye;
            return (
              <button
                key={String(value)}
                type="button"
                aria-pressed={mode === value}
                onClick={() => setMode(String(value))}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition",
                  mode === value
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ViewIcon className="size-4" />
                {String(label)}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className={cn(
          "grid min-w-0 items-start gap-6",
          mode === "split" && "xl:grid-cols-2",
        )}
      >
        <div
          className={cn("min-w-0 space-y-6", mode === "preview" && "hidden")}
        >
          {children}
        </div>
        <aside
          className={cn(
            "bg-muted/50 min-w-0 overflow-hidden rounded-3xl border",
            mode === "edit" && "hidden",
            mode === "split" && "xl:sticky xl:top-24",
          )}
        >
          <div className="bg-card flex items-center justify-between border-b px-5 py-3">
            <span className="text-muted-foreground text-xs font-medium">
              Live preview · unpublished changes
            </span>
            <div className="flex gap-1">
              {[false, true].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  aria-label={value ? "Mobile preview" : "Desktop preview"}
                  aria-pressed={mobile === value}
                  onClick={() => setMobile(value)}
                  className={cn(
                    "rounded-lg p-2 transition",
                    mobile === value && "bg-muted text-accent",
                  )}
                >
                  {value ? (
                    <Smartphone className="size-4" />
                  ) : (
                    <Monitor className="size-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[75vh] overflow-auto p-3 sm:p-5">
            <div
              className={cn(
                "bg-background mx-auto min-h-96 overflow-hidden rounded-2xl border p-5 transition-[max-width] duration-300 sm:p-7",
                mobile ? "max-w-[390px]" : "max-w-full",
              )}
            >
              {preview}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
