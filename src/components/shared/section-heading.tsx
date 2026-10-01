"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const child = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <motion.div
      className={cn("max-w-2xl", className)}
      initial={reduceMotion ? false : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={reduceMotion ? undefined : "visible"}
    >
      <motion.p className="eyebrow" variants={child}>
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl"
        variants={child}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          className="text-muted-foreground mt-5 text-base leading-7 sm:text-lg"
          variants={child}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
