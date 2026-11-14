"use client";

import {
  animate,
  cubicBezier,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motionTiming } from "@/lib/motion-timing";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const settleEase = cubicBezier(0.22, 1, 0.36, 1);

export function DesignMotion({ children }: { children: ReactNode }) {
  return <div className="design-page">{children}</div>;
}

// The stable outer target triggers a timed, one-shot construction sequence.
// Scrolling away or stopping does not interrupt an animation already started.
export function DesignReveal({
  children,
  className,
  direction = "up",
  label = "Component",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  label?: string;
  delay?: number;
}) {
  const target = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const [assembled, setAssembled] = useState(false);
  const inView = useInView(target, {
    once: true,
    margin: "0px 0px -48px 0px",
    amount: "some",
  });
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!inView || reduceMotion || assembled) return;

    let playback: ReturnType<typeof animate> | undefined;
    let introFallback: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      clearTimeout(introFallback);
      playback = animate(progress, 1, {
        duration: motionTiming.assemble * (1 - progress.get()),
        delay: Math.max(0, Math.min(delay * 1.5, 0.36)),
        ease: "linear",
        onComplete: () => setAssembled(true),
      });
    };

    // Initial visible content builds after the opening animation, rather than
    // spending its construction sequence behind that full-screen cover.
    if (document.querySelector("[data-site-intro]")) {
      window.addEventListener("portfolio:intro-complete", start, {
        once: true,
      });
      introFallback = setTimeout(start, 4000);
    } else {
      start();
    }

    return () => {
      playback?.stop();
      clearTimeout(introFallback);
      window.removeEventListener("portfolio:intro-complete", start);
    };
  }, [inView, reduceMotion, assembled, delay, progress]);
  const opacity = useTransform(progress, [0, 0.2, 0.56, 0.74], [0, 0, 0.92, 1]);
  const scale = useTransform(progress, [0, 0.22, 0.8], [0.95, 0.96, 1], {
    ease: settleEase,
  });
  const x = useTransform(
    progress,
    [0.18, 0.82],
    [direction === "left" ? -26 : direction === "right" ? 26 : 12, 0],
    { ease: settleEase },
  );
  const y = useTransform(progress, [0.18, 0.82], [24, 0], { ease: settleEase });
  const rotate = useTransform(
    progress,
    [0.18, 0.82],
    [direction === "left" ? -0.65 : 0.65, 0],
    { ease: settleEase },
  );
  const clipPath = useTransform(
    progress,
    [0.2, 0.66],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const frameOpacity = useTransform(
    progress,
    [0, 0.04, 0.8, 0.99],
    [0, 1, 1, 0],
  );
  const selectionOpacity = useTransform(
    progress,
    [0, 0.35, 0.45, 0.8, 0.99],
    [0, 0, 1, 1, 0],
  );
  const frameX = useTransform(progress, [0.02, 0.34], [0.02, 1], {
    ease: settleEase,
  });
  const frameY = useTransform(progress, [0.02, 0.42], [0.03, 1], {
    ease: settleEase,
  });
  const wireOpacity = useTransform(
    progress,
    [0, 0.12, 0.35, 0.64],
    [0, 0.5, 0.5, 0],
  );
  const layoutX = useTransform(
    progress,
    [0.02, 0.34, 0.72, 1],
    ["2%", "100%", "100%", "103%"],
    { ease: settleEase },
  );
  const layoutY = useTransform(
    progress,
    [0.02, 0.42, 0.72, 1],
    ["3%", "100%", "100%", "103%"],
    { ease: settleEase },
  );
  const styleX = useTransform(progress, [0.2, 0.62, 1], ["105%", "0%", "-2%"]);
  const styleY = useTransform(progress, [0.2, 0.62, 1], ["10%", "62%", "65%"]);
  const styleOpacity = useTransform(
    progress,
    [0.18, 0.3, 0.76, 0.98],
    [0, 1, 1, 0],
  );
  const polishX = useTransform(
    progress,
    [0.48, 0.65, 0.84, 1],
    ["12%", "40%", "92%", "100%"],
    { ease: settleEase },
  );
  const polishY = useTransform(
    progress,
    [0.48, 0.65, 0.84, 1],
    ["104%", "8%", "0%", "-3%"],
    { ease: settleEase },
  );
  const polishOpacity = useTransform(
    progress,
    [0.46, 0.55, 0.84, 0.98],
    [0, 1, 1, 0],
  );
  const lightX = useTransform(progress, [0.32, 0.88], ["0%", "360%"], {
    ease: settleEase,
  });
  const lightOpacity = useTransform(
    progress,
    [0.28, 0.42, 0.72, 0.94],
    [0, 1, 1, 0],
  );
  const finishOpacity = useTransform(progress, [0.55, 0.72, 0.98], [0, 0.6, 0]);
  const snapScale = useTransform(
    progress,
    [0.57, 0.77, 0.98],
    [0.99, 1.006, 1],
    { ease: settleEase },
  );

  const settled = !mounted || reduceMotion || assembled;

  return (
    <div
      className={`design-reveal${className ? ` ${className}` : ""}`}
      data-assembled={settled ? "true" : "false"}
      onFocusCapture={() => setAssembled(true)}
      ref={target}
    >
      <motion.div
        className="design-reveal-content"
        style={
          settled
            ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, clipPath: "none" }
            : { opacity, scale, x, y, rotate, clipPath }
        }
      >
        {children}
      </motion.div>
      {!settled ? (
        <div aria-hidden="true" className="design-build-layer">
          <motion.div
            className="design-wireframe"
            style={{ opacity: wireOpacity }}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
              <path
                d="M0 25H100M0 75H100M25 0V100M75 0V100M0 0L100 100M100 0L0 100"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </motion.div>
          <motion.div
            className="design-build-frame"
            style={{ opacity: frameOpacity, scaleX: frameX, scaleY: frameY }}
          />
          <motion.div
            className="design-build-selection"
            style={{ opacity: selectionOpacity }}
          >
            <span className="design-frame-label">
              {label} <span>· auto layout</span>
            </span>
            <i />
            <i />
            <i />
            <i />
          </motion.div>
          <div className="design-light-clip">
            <motion.div
              className="design-light-sweep"
              style={{ x: lightX, opacity: lightOpacity }}
            />
          </div>
          <motion.div
            className="design-finish-glow"
            style={{ opacity: finishOpacity, scale: snapScale }}
          />
          <motion.div
            className="design-cursor-travel"
            style={{ x: layoutX, y: layoutY, opacity: frameOpacity }}
          >
            <DesignerCursor label="Layout" color="var(--design-layout-color)" />
          </motion.div>
          <motion.div
            className="design-cursor-travel design-style-cursor"
            style={{ x: styleX, y: styleY, opacity: styleOpacity }}
          >
            <DesignerCursor label="Style" color="var(--design-style-color)" />
          </motion.div>
          <motion.div
            className="design-cursor-travel design-polish-cursor"
            style={{ x: polishX, y: polishY, opacity: polishOpacity }}
          >
            <DesignerCursor label="Polish" color="var(--design-polish-color)" />
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}

function DesignerCursor({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="design-cursor"
      style={{ "--designer-color": color } as CSSProperties}
    >
      <svg fill="currentColor" viewBox="0 0 24 28">
        <path
          d="M3 2 21 17l-8 1-4 8L3 2Z"
          stroke="var(--background)"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
      <span>{label}</span>
    </span>
  );
}

export function DesignGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
