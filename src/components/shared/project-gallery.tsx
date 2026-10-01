"use client";

import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useState } from "react";
import { CmsImage } from "@/components/shared/cms-image";
import { ImageLightbox } from "@/components/shared/image-lightbox";
import { cn } from "@/lib/utils";

export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const selected = Math.min(active, images.length - 1);
  const move = (step: number) =>
    setActive((selected + step + images.length) % images.length);
  return (
    <section aria-label={`${title} gallery`} className="container pb-24">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <Images className="size-4" />
            In detail
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            A closer look.
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Select a view. Open it to explore the details.
        </p>
      </div>
      <div className="bg-card overflow-hidden rounded-3xl border">
        <div className="bg-muted/40 relative p-3 sm:p-6">
          <ImageLightbox
            key={images[selected]}
            src={images[selected]}
            alt={`${title} — view ${selected + 1}`}
          >
            <div className="gallery-stage bg-background relative aspect-[4/3] overflow-hidden rounded-xl border sm:aspect-[16/9]">
              <CmsImage
                src={images[selected]}
                alt={`${title} — view ${selected + 1}`}
                fill
                className="object-contain p-2 sm:p-4"
                sizes="(min-width: 1200px) 1100px, 95vw"
              />
            </div>
          </ImageLightbox>
        </div>
        <div className="flex items-center justify-between gap-4 border-t px-5 py-4 sm:px-7">
          <p
            className="text-muted-foreground font-mono text-xs"
            aria-live="polite"
          >
            VIEW{" "}
            <span className="text-foreground">
              {String(selected + 1).padStart(2, "0")}
            </span>{" "}
            / {String(images.length).padStart(2, "0")}
          </p>
          <div className="flex gap-2">
            <button
              disabled={images.length < 2}
              aria-label="Previous gallery image"
              onClick={() => move(-1)}
              className="gallery-control"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              disabled={images.length < 2}
              aria-label="Next gallery image"
              onClick={() => move(1)}
              className="gallery-control"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        {images.length > 1 && (
          <div
            className="flex gap-3 overflow-x-auto border-t p-4 sm:px-7"
            aria-label="Choose gallery image"
          >
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                onClick={() => setActive(index)}
                aria-label={`Show view ${index + 1}`}
                aria-pressed={index === selected}
                className={cn(
                  "relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg border-2 transition duration-200 sm:w-36",
                  index === selected
                    ? "border-accent opacity-100"
                    : "border-transparent opacity-55 hover:opacity-100",
                )}
              >
                <CmsImage
                  src={src}
                  alt=""
                  fill
                  className="bg-muted object-contain"
                  sizes="144px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
