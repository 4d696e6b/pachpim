"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-foreground/25 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="bg-background fixed top-1/2 left-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border p-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="bg-destructive/10 text-destructive grid size-10 shrink-0 place-items-center rounded-xl">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground mt-2 text-sm leading-6">
                {description}
              </Dialog.Description>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button onClick={onConfirm} variant="destructive">
                {confirmLabel}
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Close
            aria-label="Close"
            className="text-muted-foreground hover:bg-muted absolute top-4 right-4 rounded-full p-2"
          >
            <X className="size-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
