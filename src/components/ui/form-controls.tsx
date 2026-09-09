import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "border-input bg-background placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20 h-11 w-full rounded-xl border px-3 text-sm transition outline-none focus:ring-2 disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "border-input bg-background placeholder:text-muted-foreground focus:border-accent focus:ring-accent/20 min-h-32 w-full resize-y rounded-xl border px-3 py-3 text-sm transition outline-none focus:ring-2 disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium", className)} {...props} />;
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-destructive text-sm">
      {children}
    </p>
  );
}

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "border-border bg-muted text-muted-foreground inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-xl", className)}
      {...props}
    />
  );
}
