"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const technologies = [
  "TypeScript",
  "Next.js",
  "React",
  "Firebase",
  "Node.js",
  "Real-time systems",
  "Accessible UI",
];

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export function TechRail() {
  const reduceMotion = useReducedMotion();
  const firstSet = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const direction = useRef(-1);
  const positioned = useRef(false);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    const element = firstSet.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setSetWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!setWidth || positioned.current) return;
    x.set(-setWidth * 2);
    positioned.current = true;
  }, [setWidth, x]);

  useAnimationFrame((_, delta) => {
    if (
      reduceMotion ||
      paused ||
      dragging.current ||
      !setWidth ||
      !positioned.current
    ) {
      return;
    }

    const next = x.get() + direction.current * 0.03 * delta;
    x.set(wrap(-setWidth * 3, -setWidth * 2, next));
  });

  const moveBy = (distance: number) => {
    if (!setWidth) return;
    x.set(wrap(-setWidth * 3, -setWidth * 2, x.get() + distance));
  };

  return (
    <div
      aria-label="Technology skills. Drag horizontally or use the arrow keys to explore."
      className="tech-rail border-y"
      onBlur={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          direction.current = -1;
          moveBy(-120);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          direction.current = 1;
          moveBy(120);
        }
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      role="region"
      tabIndex={0}
    >
      <motion.div
        className="tech-rail-track cursor-grab py-3 font-mono text-xs tracking-[0.14em] uppercase active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -setWidth * 3, right: -setWidth }}
        dragElastic={0.04}
        dragMomentum={false}
        onDrag={(_, info) => {
          if (Math.abs(info.velocity.x) > 20) {
            direction.current = info.velocity.x > 0 ? 1 : -1;
          }
        }}
        onDragEnd={() => {
          dragging.current = false;
          if (setWidth) {
            x.set(wrap(-setWidth * 3, -setWidth * 2, x.get()));
          }
        }}
        onDragStart={() => {
          dragging.current = true;
        }}
        style={{ touchAction: "pan-y", x }}
      >
        {[0, 1, 2, 3, 4].map((copy) => (
          <div
            aria-hidden={copy !== 2}
            className="tech-rail-set flex shrink-0 items-center gap-10 pr-10"
            key={copy}
            ref={copy === 0 ? firstSet : undefined}
          >
            {technologies.map((item) => (
              <span
                className="text-muted-foreground flex items-center gap-3 whitespace-nowrap"
                key={item}
              >
                <span className="text-accent">◆</span> {item}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
