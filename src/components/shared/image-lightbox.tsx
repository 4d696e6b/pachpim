"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Maximize2, X } from "lucide-react";

import { CmsImage } from "@/components/shared/cms-image";
import { cn } from "@/lib/utils";

export function ImageLightbox({
  src,
  alt,
  children,
  className,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          aria-label={`View ${alt} in full size`}
          className={cn(
            "image-lightbox-trigger group/lightbox relative block w-full cursor-pointer text-left",
            className,
          )}
          type="button"
        >
          {children}
          <span className="bg-background/80 text-foreground pointer-events-none absolute right-3 bottom-3 grid size-9 translate-y-1 place-items-center rounded-full border opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover/lightbox:translate-y-0 group-hover/lightbox:opacity-100 group-focus-visible/lightbox:translate-y-0 group-focus-visible/lightbox:opacity-100">
            <Maximize2 className="size-4" />
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[80] bg-black/75 backdrop-blur-md" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[90] h-[min(88vh,900px)] w-[min(94vw,1280px)] -translate-x-1/2 -translate-y-1/2 outline-none">
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Description className="sr-only">
            Full-size image preview. Press Escape or use the close button to
            return.
          </Dialog.Description>
          <div className="bg-background/70 relative h-full w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur">
            <CmsImage
              alt={alt}
              className="object-contain p-2 sm:p-5"
              fill
              sizes="94vw"
              src={src}
            />
          </div>
          <Dialog.Close
            aria-label="Close image preview"
            className="bg-background/90 text-foreground hover:bg-background absolute -top-3 -right-3 grid size-11 cursor-pointer place-items-center rounded-full border shadow-lg transition hover:scale-105"
          >
            <X className="size-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
