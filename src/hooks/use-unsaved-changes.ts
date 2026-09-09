"use client";

import { useEffect } from "react";

export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
}
