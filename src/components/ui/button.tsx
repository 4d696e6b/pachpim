import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn-neon inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "btn-neon-filled bg-foreground px-5 py-2.5 text-background hover:bg-foreground/85",
        accent:
          "btn-neon-filled bg-accent px-5 py-2.5 text-accent-foreground shadow-sm hover:bg-accent/90",
        outline:
          "border border-border bg-background/70 px-5 py-2.5 hover:bg-muted",
        ghost: "bg-background px-4 py-2 hover:bg-muted",
        destructive:
          "btn-neon-filled bg-destructive px-5 py-2.5 text-white hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11",
        lg: "h-12 px-6",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
