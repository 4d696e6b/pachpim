"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Braces, RotateCcw } from "lucide-react";
import { useState } from "react";

import { CmsImage } from "@/components/shared/cms-image";

type ProfileFlipCardProps = {
  availability?: string;
  imageUrl?: string;
  location?: string;
  name: string;
  role?: string;
};

export function ProfileFlipCard({
  availability,
  imageUrl,
  location,
  name,
  role,
}: ProfileFlipCardProps) {
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <button
      aria-label={
        flipped ? "Show profile portrait" : "Show profile information"
      }
      aria-pressed={flipped}
      className="absolute inset-0 cursor-pointer text-left"
      onBlur={() => setFlipped(false)}
      onClick={(event) => {
        if (event.detail === 0) setFlipped((current) => !current);
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") {
          setFlipped((current) => !current);
        }
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setFlipped(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setFlipped(false);
      }}
      type="button"
    >
      <motion.span
        animate={{ rotateY: flipped ? 180 : 0 }}
        className="relative block size-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{
          duration: reduceMotion ? 0.01 : 0.58,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span
          aria-hidden={flipped}
          className="bg-muted absolute inset-0 block"
          style={{ backfaceVisibility: "hidden" }}
        >
          {imageUrl ? (
            <CmsImage
              alt={name + " portrait"}
              className="portrait-image object-cover transition-transform duration-700"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 80vw"
              src={imageUrl}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center">
              <span className="text-foreground/10 text-8xl font-semibold tracking-tighter">
                {initials}
              </span>
            </span>
          )}

          <span className="from-background/75 absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t to-transparent px-5 pt-14 pb-5">
            <span className="text-background font-mono text-[10px] tracking-[0.18em] uppercase">
              Hover or tap to inspect
            </span>
            <Braces className="text-accent size-4" />
          </span>
        </span>

        <span
          aria-hidden={!flipped}
          className="absolute inset-0 block bg-[#0b1110] p-5 text-[#d8e2df] sm:p-7"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#7d918c] uppercase">
              profile.json
            </span>
            <RotateCcw className="size-3.5 text-[#5dd6b3]" />
          </span>

          <span className="mt-5 block font-mono text-xs leading-6 sm:text-sm sm:leading-7">
            <span className="block text-[#7d918c]">{"{"}</span>
            <JsonLine keyName="name" value={name} />
            <JsonLine keyName="role" value={role || "Software developer"} />
            <JsonLine keyName="location" value={location || "Thailand"} />
            <span className="block pl-4">
              <span className="text-[#8ed8ff]">&quot;focus&quot;</span>
              <span className="text-[#7d918c]">: [</span>
              <span className="text-[#ffd38e]">&quot;full-stack&quot;</span>
              <span className="text-[#7d918c]">, </span>
              <span className="text-[#ffd38e]">&quot;real-time&quot;</span>
              <span className="text-[#7d918c]">],</span>
            </span>
            <JsonLine
              keyName="status"
              last
              value={availability || "Open to opportunities"}
            />
            <span className="block text-[#7d918c]">{"}"}</span>
          </span>

          <span className="absolute inset-x-5 bottom-5 flex items-center gap-2 border-t border-white/10 pt-4 font-mono text-[9px] tracking-[0.14em] text-[#5dd6b3] uppercase sm:inset-x-7 sm:bottom-7">
            <span className="size-1.5 animate-pulse rounded-full bg-current" />
            Human-readable developer
          </span>
        </span>
      </motion.span>
    </button>
  );
}

function JsonLine({
  keyName,
  last = false,
  value,
}: {
  keyName: string;
  last?: boolean;
  value: string;
}) {
  return (
    <span className="block pl-4">
      <span className="text-[#8ed8ff]">&quot;{keyName}&quot;</span>
      <span className="text-[#7d918c]">: </span>
      <span className="text-[#ffd38e]">&quot;{value}&quot;</span>
      {!last ? <span className="text-[#7d918c]">,</span> : null}
    </span>
  );
}
