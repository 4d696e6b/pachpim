"use client";

import NextLink from "next/link";
import {
  forwardRef,
  useCallback,
  useRef,
  type ComponentProps,
  type RefCallback,
} from "react";

import { usePageTransition } from "@/components/layout/page-transition";
import { pageTransitionDestination } from "@/lib/page-navigation";

type TransitionLinkProps = ComponentProps<typeof NextLink>;

const TransitionLink = forwardRef<
  HTMLAnchorElement,
  Omit<TransitionLinkProps, "ref">
>(function TransitionLink({ onNavigate, ...props }, forwardedRef) {
  const transition = usePageTransition();
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const mergedRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      anchorRef.current = node;
      if (typeof forwardedRef === "function") {
        const cleanup = (forwardedRef as RefCallback<HTMLAnchorElement>)(node);
        if (typeof cleanup === "function") {
          return () => {
            anchorRef.current = null;
            cleanup();
          };
        }
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const handleNavigate: NonNullable<TransitionLinkProps["onNavigate"]> = (
    event,
  ) => {
    let canceled = false;
    onNavigate?.({
      preventDefault() {
        canceled = true;
        event.preventDefault();
      },
    });

    // onNavigate already preserves modifier keys, downloads, and external links.
    // Keep custom history/scroll behavior with Next when this provider cannot
    // reproduce those options through its plain navigate(href) interface.
    if (
      canceled ||
      !transition ||
      props.replace ||
      props.scroll === false ||
      !anchorRef.current
    ) {
      return;
    }

    const destination = pageTransitionDestination(
      anchorRef.current.href,
      window.location.href,
    );
    if (!destination) return;

    event.preventDefault();
    transition.navigate(destination);
  };

  return <NextLink {...props} onNavigate={handleNavigate} ref={mergedRef} />;
});

export default TransitionLink;
