"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function AmbientMotion() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(-500);
  const pointerY = useMotionValue(-500);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 25 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 25 });
  const background = useMotionTemplate`radial-gradient(520px circle at ${smoothX}px ${smoothY}px, color-mix(in srgb, var(--accent) 9%, transparent), transparent 72%)`;

  useEffect(() => {
    if (reduceMotion) return;
    const update = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, [pointerX, pointerY, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{ background }}
    />
  );
}

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="bg-accent fixed top-0 right-0 left-0 z-[70] h-0.5 origin-left"
      style={{ scaleX }}
    />
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: delay, staggerChildren: 0.09 },
        },
      }}
      viewport={{ once, margin: "-60px" }}
      whileInView={reduceMotion ? undefined : "visible"}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        reduceMotion
          ? undefined
          : {
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.62, ease },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function FloatingFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
      className={cn("will-change-transform", className)}
      transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
      whileHover={reduceMotion ? undefined : { scale: 1.015, rotate: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export function HeroVisual({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 55]);
  const rotate = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 1.2]);

  return (
    <motion.div className="relative" style={{ rotate, y }}>
      {children}
      <FloatingLabel className="top-[18%] -left-6" delay={0}>
        TypeScript
      </FloatingLabel>
      <FloatingLabel className="top-[34%] -right-5" delay={1.2}>
        Next.js
      </FloatingLabel>
      <FloatingLabel className="bottom-[18%] -left-8" delay={2.1}>
        Realtime
      </FloatingLabel>
    </motion.div>
  );
}

function FloatingLabel({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
      className={cn(
        "bg-background/85 border-border/80 absolute z-10 hidden rounded-full border px-3 py-1.5 font-mono text-[11px] font-medium backdrop-blur md:block",
        className,
      )}
      transition={{
        delay,
        duration: 4.5,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <span className="text-accent mr-1.5">&lt;/&gt;</span>
      {children}
    </motion.span>
  );
}

export function useScrollDirection() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(current > previous && current > 120);
  });

  return hidden;
}
