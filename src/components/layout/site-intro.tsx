"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, MousePointer2, Play } from "lucide-react";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteIntro() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduceMotion || !visible) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const timer = window.setTimeout(() => setVisible(false), 1550);

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
          className="bg-background fixed inset-0 z-[100] grid place-items-center overflow-hidden px-5"
          exit={{
            maskImage:
              "radial-gradient(circle at center, transparent 0%, transparent 150%, black 151%)",
          }}
          initial={{
            maskImage:
              "radial-gradient(circle at center, transparent 0%, black 0%)",
          }}
          transition={{ duration: 0.5, ease }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="border-border bg-card relative w-full max-w-[24rem] overflow-hidden rounded-2xl border shadow-[0_24px_100px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="border-border bg-muted/45 flex h-10 items-center justify-between border-b px-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#ff6b6b]" />
                <span className="size-2 rounded-full bg-[#ffd166]" />
                <span className="size-2 rounded-full bg-[#5dd6b3]" />
              </div>
              <span className="text-muted-foreground font-mono text-[9px] tracking-[0.2em] uppercase">
                profile.ts
              </span>
            </div>

            <div className="px-5 pt-5 pb-4 sm:px-6">
              <div className="flex min-h-12 items-center font-mono text-sm sm:text-base">
                <span className="text-muted-foreground mr-4 select-none">
                  01
                </span>
                <span className="text-accent mr-2">$</span>
                <span className="relative inline-flex">
                  <motion.span
                    animate={{ width: "13ch" }}
                    className="block overflow-hidden whitespace-nowrap"
                    initial={{ width: 0 }}
                    transition={{
                      delay: 0.18,
                      duration: 0.65,
                      ease: "linear",
                    }}
                  >
                    run_profile()
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [1, 1, 0, 0, 1] }}
                    className="bg-accent ml-0.5 inline-block h-5 w-px"
                    transition={{
                      duration: 0.55,
                      repeat: 1,
                      times: [0, 0.45, 0.46, 0.95, 1],
                    }}
                  />
                </span>
              </div>

              <div className="border-border mt-3 flex items-center justify-between border-t pt-4">
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="text-accent flex items-center gap-1.5 font-mono text-[10px]"
                  initial={{ opacity: 0, x: -6 }}
                  transition={{ delay: 1.28, duration: 0.2 }}
                >
                  <Check className="size-3" />
                  Profile ready
                </motion.div>

                <motion.button
                  animate={{ opacity: 1, scale: [1, 1, 0.94, 1] }}
                  className="bg-accent text-accent-foreground flex h-8 items-center gap-2 rounded-lg px-3 font-mono text-[10px] font-semibold tracking-wide uppercase"
                  initial={{ opacity: 0 }}
                  tabIndex={-1}
                  transition={{
                    opacity: { delay: 0.72, duration: 0.18 },
                    scale: {
                      delay: 1.16,
                      duration: 0.28,
                      times: [0, 0.25, 0.55, 1],
                    },
                  }}
                  type="button"
                >
                  <Play className="size-3 fill-current" />
                  Execute
                </motion.button>
              </div>
            </div>

            <motion.div
              animate={{
                opacity: [0, 1, 1, 0],
                x: [34, 0, 0, -2],
                y: [28, 0, 0, 2],
                scale: [1, 1, 0.82, 0.82],
              }}
              className="text-foreground pointer-events-none absolute right-8 bottom-5 drop-shadow-lg"
              initial={{ opacity: 0, x: 34, y: 28 }}
              transition={{
                delay: 0.9,
                duration: 0.55,
                ease,
                times: [0, 0.42, 0.7, 1],
              }}
            >
              <MousePointer2 className="size-5 fill-current" />
            </motion.div>
          </motion.div>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground absolute bottom-8 font-mono text-[9px] tracking-[0.24em] uppercase"
            initial={{ opacity: 0, y: 4 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            Pacharapol Pimpa · Portfolio
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
