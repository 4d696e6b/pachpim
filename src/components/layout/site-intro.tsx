"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { SiteMark } from "@/components/shared/site-mark";

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteIntro() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduceMotion || !visible) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const timer = window.setTimeout(() => setVisible(false), 950);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [reduceMotion, visible]);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-hidden="true"
          className="bg-background fixed inset-0 z-[100] grid place-items-center overflow-hidden"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.42, ease }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
            exit={{ opacity: 0, scale: 1.04, y: -12 }}
            initial={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.34, ease }}
          >
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-muted-foreground mb-5 font-mono text-[10px] tracking-[0.32em] uppercase"
              initial={{ opacity: 0, y: 6 }}
              transition={{ delay: 0.08, duration: 0.28, ease }}
            >
              Portfolio · 2026
            </motion.p>

            <div className="relative grid size-24 place-items-center">
              <motion.div
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                className="border-accent/30 absolute inset-0 rounded-[1.7rem] border"
                initial={{ opacity: 0, rotate: -10, scale: 0.74 }}
                transition={{ duration: 0.48, ease }}
              />
              <motion.div
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                className="border-border absolute inset-2 rounded-[1.35rem] border"
                initial={{ opacity: 0, rotate: 12, scale: 0.8 }}
                transition={{ delay: 0.06, duration: 0.46, ease }}
              />
              <motion.div
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                initial={{ opacity: 0, scale: 0.68, rotate: -8 }}
                transition={{ delay: 0.12, duration: 0.42, ease }}
              >
                <SiteMark className="size-14 rounded-2xl shadow-[0_0_40px_color-mix(in_srgb,var(--accent)_28%,transparent)]" />
              </motion.div>

              <motion.span
                animate={{ opacity: [0, 1, 1], x: 0 }}
                className="text-accent absolute -left-5 font-mono text-xl"
                initial={{ opacity: 0, x: 8 }}
                transition={{ delay: 0.18, duration: 0.32, ease }}
              >
                {"{"}
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 1], x: 0 }}
                className="text-accent absolute -right-5 font-mono text-xl"
                initial={{ opacity: 0, x: -8 }}
                transition={{ delay: 0.18, duration: 0.32, ease }}
              >
                {"}"}
              </motion.span>
            </div>

            <div className="bg-border mt-6 h-px w-40 overflow-hidden rounded-full">
              <motion.div
                animate={{ scaleX: 1 }}
                className="bg-accent h-full origin-left"
                initial={{ scaleX: 0 }}
                transition={{ delay: 0.12, duration: 0.7, ease }}
              />
            </div>
            <motion.p
              animate={{ opacity: 1 }}
              className="text-muted-foreground mt-3 font-mono text-[9px] tracking-[0.24em] uppercase"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.38, duration: 0.24 }}
            >
              Building the experience
            </motion.p>
          </motion.div>

          <motion.div
            animate={{ opacity: [0, 0.7, 0], scale: [0.7, 1.35, 1.7] }}
            className="border-accent/20 pointer-events-none absolute size-72 rounded-full border"
            initial={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.9, ease }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
