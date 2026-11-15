"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motionTiming } from "@/lib/motion-timing";
import { getCursorPersonality } from "@/lib/cursor-personality";

type Phase = "idle" | "erase" | "waiting" | "build";
type Piece = {
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
};
type TransitionState = { phase: Phase; pieces: Piece[]; sequence: number };

const PageTransitionContext = createContext<{
  navigate: (href: string) => void;
} | null>(null);
export function usePageTransition() {
  return useContext(PageTransitionContext);
}

function visiblePieces(root: HTMLElement): Piece[] {
  const chosen: HTMLElement[] = [];
  const candidates = root.querySelectorAll<HTMLElement>(
    ".design-reveal, .collection-heading, .project-card, .journal-card, .contact-card, .portrait-frame, .timeline-item, .skill-group, h1, h2, p, form",
  );
  for (const element of candidates) {
    if (chosen.some((parent) => parent.contains(element))) continue;
    const rect = element.getBoundingClientRect();
    if (
      rect.width < 24 ||
      rect.height < 12 ||
      rect.bottom < 78 ||
      rect.top > window.innerHeight - 10
    )
      continue;
    chosen.push(element);
    if (chosen.length === 10) break;
  }
  if (!chosen.length && root.firstElementChild instanceof HTMLElement)
    chosen.push(root.firstElementChild);
  return chosen.map((element) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(8, rect.left);
    const y = Math.max(76, rect.top);
    return {
      element,
      x,
      y,
      width: Math.max(1, Math.min(rect.right, window.innerWidth - 8) - x),
      height: Math.max(1, Math.min(rect.bottom, window.innerHeight - 10) - y),
    };
  });
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const operation = useRef(0);
  const animations = useRef<Animation[]>([]);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreScroll = useRef<(() => void) | null>(null);
  const previousPath = useRef(pathname);
  const [state, setState] = useState<TransitionState>({
    phase: "idle",
    pieces: [],
    sequence: 0,
  });

  const clearAnimations = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);

  const finish = useCallback(() => {
    operation.current++;
    clearAnimations();
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    if (root.current) {
      root.current.style.removeProperty("opacity");
      root.current.inert = false;
    }
    restoreScroll.current?.();
    restoreScroll.current = null;
    busy.current = false;
    setState((current) => ({
      phase: "idle",
      pieces: [],
      sequence: current.sequence,
    }));
  }, [clearAnimations]);

  const playPieces = useCallback(
    async (pieces: Piece[], phase: "erase" | "build") => {
      const tracks = pieces.map(({ element }, index) =>
        element.animate(
          phase === "erase"
            ? [
                { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0)" },
                {
                  opacity: 0.65,
                  transform: "translateY(-3px) scale(.99)",
                  offset: 0.4,
                },
                {
                  opacity: 0,
                  transform: "translateY(-10px) scale(.96)",
                  clipPath: "inset(0 0 100% 0)",
                },
              ]
            : [
                {
                  opacity: 0,
                  transform: "translateY(16px) scale(.97)",
                  clipPath: "inset(0 100% 0 0)",
                },
                { opacity: 0.85, clipPath: "inset(0 0 0 0)", offset: 0.6 },
                { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0)" },
              ],
          {
            duration:
              1000 *
              (phase === "erase"
                ? motionTiming.erasePage
                : motionTiming.buildPage),
            delay:
              index *
              1000 *
              (phase === "erase"
                ? motionTiming.eraseStagger
                : motionTiming.buildStagger),
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "both",
          },
        ),
      );
      animations.current.push(...tracks);
      await Promise.all(
        tracks.map((track) => track.finished.catch(() => undefined)),
      );
    },
    [],
  );

  const scrollToTop = useCallback(() => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    html.style.scrollBehavior = previousBehavior;
  }, []);

  const lockScroll = useCallback(() => {
    if (restoreScroll.current) return;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    const previousGutter = html.style.scrollbarGutter;
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    restoreScroll.current = () => {
      html.style.overflow = previousOverflow;
      html.style.scrollbarGutter = previousGutter;
    };
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;
      if (reduceMotion) {
        scrollToTop();
        router.push(href, { scroll: false });
        return;
      }
      busy.current = true;
      const id = ++operation.current;
      router.prefetch(href);
      scrollToTop();
      lockScroll();
      // Never leave a hidden or locked page behind if navigation fails.
      timeout.current = setTimeout(finish, 9000);

      void (async () => {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        if (operation.current !== id || !root.current) return;
        const pieces = visiblePieces(root.current);
        root.current.inert = true;
        setState((current) => ({
          phase: "erase",
          pieces,
          sequence: current.sequence + 1,
        }));
        await playPieces(pieces, "erase");
        if (operation.current !== id || !root.current) return;
        root.current.style.opacity = "0";
        setState((current) => ({ ...current, phase: "waiting", pieces: [] }));
        router.push(href, { scroll: false });
      })().catch(() => {
        if (operation.current !== id) return;
        finish();
        router.push(href);
      });
    },
    [reduceMotion, router, scrollToTop, lockScroll, finish, playPieces],
  );

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (reduceMotion || !root.current) {
      finish();
      return;
    }

    const id = ++operation.current;
    busy.current = true;
    clearAnimations();
    scrollToTop();
    lockScroll();
    root.current.style.opacity = "0";
    root.current.inert = true;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(finish, 9000);

    void (async () => {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      if (operation.current !== id || !root.current) return;
      const pieces = visiblePieces(root.current);
      const playback = playPieces(pieces, "build");
      root.current.style.removeProperty("opacity");
      setState((current) => ({
        phase: "build",
        pieces,
        sequence: current.sequence + 1,
      }));
      await playback;
      if (operation.current !== id) return;
      finish();
      // Announce the destination by focusing its heading without moving scroll.
      let heading = root.current?.querySelector<HTMLElement>("h1");
      if (window.location.hash) {
        try {
          const anchor = document.getElementById(
            decodeURIComponent(window.location.hash.slice(1)),
          );
          if (anchor) {
            anchor.scrollIntoView({ behavior: "instant" });
            heading = anchor;
          }
        } catch {
          // A malformed fragment must not interrupt navigation recovery.
        }
      }
      if (heading) {
        const hadTabIndex = heading.hasAttribute("tabindex");
        if (!hadTabIndex) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        if (!hadTabIndex) heading.removeAttribute("tabindex");
      }
    })().catch(finish);
  }, [
    pathname,
    reduceMotion,
    clearAnimations,
    finish,
    lockScroll,
    playPieces,
    scrollToTop,
  ]);

  useEffect(() => {
    if (reduceMotion && busy.current) finish();
  }, [reduceMotion, finish]);

  const invalidateOperation = useCallback(() => {
    operation.current++;
  }, []);
  useEffect(() => {
    return () => {
      invalidateOperation();
      clearAnimations();
      if (timeout.current) clearTimeout(timeout.current);
      restoreScroll.current?.();
    };
  }, [clearAnimations, invalidateOperation]);

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      <div
        aria-busy={state.phase !== "idle"}
        className="page-transition-content"
        ref={root}
      >
        {children}
      </div>
      {state.phase !== "idle"
        ? createPortal(
            <div
              aria-hidden="true"
              className="page-transition-layer"
              data-phase={state.phase}
            >
              <div className="page-transition-veil" />
              {state.pieces.map((piece, index) => (
                <TransitionFrame
                  key={`${state.sequence}-${index}`}
                  piece={piece}
                  index={index}
                  phase={state.phase}
                />
              ))}
              <div className="page-transition-caption">
                {state.phase === "erase"
                  ? "Clearing canvas"
                  : state.phase === "waiting"
                    ? "Opening next page"
                    : "Building the next page"}
                <span> / design in motion</span>
              </div>
            </div>,
            document.body,
          )
        : null}
    </PageTransitionContext.Provider>
  );
}

function TransitionFrame({
  piece,
  index,
  phase,
}: {
  piece: Piece;
  index: number;
  phase: Phase;
}) {
  const isErasing = phase === "erase";
  const duration = isErasing ? motionTiming.erasePage : motionTiming.buildPage;
  const delay =
    index * (isErasing ? motionTiming.eraseStagger : motionTiming.buildStagger);
  const role = (["layout", "style", "polish"] as const)[index % 3];
  const personality = getCursorPersonality(
    `${phase}:${index}:${Math.round(piece.width)}:${Math.round(piece.height)}`,
    role,
  );
  const cursorDuration = duration * personality.speed;
  const cursorDelay = delay + duration * personality.start;
  const turnX = (isErasing ? 55 : 45) + personality.bendX;
  const turnY = (isErasing ? 28 : 65) + personality.bendY;
  const cursorEase =
    role === "layout"
      ? ([0.16, 1, 0.3, 1] as const)
      : role === "style"
        ? ([0.4, 0, 0.2, 1] as const)
        : ([0.22, 0.7, 0.25, 1] as const);
  const color =
    index % 3 === 0
      ? "var(--accent)"
      : index % 3 === 1
        ? "color-mix(in srgb, var(--accent) 90%, var(--foreground))"
        : "color-mix(in srgb, var(--accent) 75%, var(--foreground))";
  return (
    <div
      className="page-transition-piece"
      style={
        {
          left: piece.x,
          top: piece.y,
          width: piece.width,
          height: piece.height,
          "--designer-color": color,
        } as CSSProperties
      }
    >
      <motion.div
        className="page-transition-frame"
        initial={{
          opacity: 0,
          scaleX: isErasing ? 1 : 0.03,
          scaleY: isErasing ? 1 : 0.03,
        }}
        animate={{
          opacity: [0, 1, 1, 0],
          scaleX: isErasing ? [1, 1, 0.02] : [0.03, 1, 1],
          scaleY: isErasing ? [1, 1, 0.02] : [0.03, 1, 1],
        }}
        transition={{ duration, delay }}
      >
        <span>
          {isErasing ? "Remove" : "Frame"} /{" "}
          {String(index + 1).padStart(2, "0")}
        </span>
        <i />
        <i />
        <i />
        <i />
      </motion.div>
      {index < 3 ? (
        <motion.div
          className="page-transition-cursor"
          initial={{
            x: isErasing ? "100%" : "0%",
            y: isErasing ? "100%" : "0%",
            opacity: 0,
          }}
          animate={{
            x: [
              isErasing ? "100%" : "0%",
              `${turnX}%`,
              `${turnX}%`,
              isErasing ? "2%" : "100%",
              isErasing ? "-3%" : "102%",
            ],
            y: [
              isErasing ? "100%" : "0%",
              `${turnY}%`,
              `${turnY}%`,
              isErasing ? "0%" : "98%",
              isErasing ? "-3%" : "102%",
            ],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: cursorDuration,
            delay: cursorDelay,
            times: [0, 0.32, 0.32 + personality.hesitation, 0.82, 1],
            ease: cursorEase,
          }}
        >
          <span className="design-cursor">
            <svg fill="currentColor" viewBox="0 0 24 28">
              <path
                d="M3 2 21 17l-8 1-4 8L3 2Z"
                stroke="var(--background)"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <span>{["Layout", "Style", "Polish"][index]}</span>
          </span>
        </motion.div>
      ) : null}
    </div>
  );
}
