"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";

import { SiteMark } from "@/components/shared/site-mark";
import { Button } from "@/components/ui/button";
import { mainNavigation, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      aria-label="Toggle color theme"
      className="rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const brandName = name.trim() || siteConfig.name;

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between">
        <Link
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          href="/"
        >
          <SiteMark className="size-7 rounded-lg" />
          {brandName}
          <span className="text-accent">.</span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {mainNavigation.map((item) => (
            <Link
              className={cn(
                "text-muted-foreground hover:bg-muted hover:text-foreground rounded-full px-4 py-2 text-sm transition",
                pathname === item.href && "bg-muted text-foreground",
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button
                aria-label="Open navigation"
                className="md:hidden"
                size="icon"
                variant="ghost"
              >
                <Menu className="size-5" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay bg-foreground/20 fixed inset-0 z-50 backdrop-blur-sm" />
              <Dialog.Content className="sidebar-panel-right border-border bg-background fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] border-l p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-semibold">
                    Navigation
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <Button
                      aria-label="Close navigation"
                      size="icon"
                      variant="ghost"
                    >
                      <X className="size-5" />
                    </Button>
                  </Dialog.Close>
                </div>
                <nav
                  aria-label="Mobile navigation"
                  className="sidebar-nav mt-10 grid gap-2"
                >
                  {mainNavigation.map((item, index) => (
                    <Link
                      className="hover:bg-muted rounded-xl px-4 py-3 text-lg font-medium"
                      href={item.href}
                      key={item.href}
                      onClick={() => setOpen(false)}
                      style={{ "--nav-i": index } as CSSProperties}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
