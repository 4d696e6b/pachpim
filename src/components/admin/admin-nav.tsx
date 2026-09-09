"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  FileText,
  FolderKanban,
  Home,
  ImageIcon,
  Menu,
  MessageSquare,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/notes", label: "Notes", icon: FileText },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

function Navigation({
  close,
  className,
  staggerLinks = false,
}: {
  close?: () => void;
  className?: string;
  staggerLinks?: boolean;
}) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Dashboard navigation"
      className={cn("grid gap-1", staggerLinks && "sidebar-nav", className)}
    >
      {links.map(({ href, label, icon: Icon }, index) => {
        const active =
          href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            className={cn(
              "text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active && "bg-muted text-foreground",
            )}
            href={href}
            key={href}
            onClick={close}
            style={
              staggerLinks
                ? ({ "--nav-i": index } as CSSProperties)
                : undefined
            }
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="border-border bg-card fixed inset-y-0 left-0 hidden w-64 border-r p-5 lg:block">
      <Link className="mb-10 block font-semibold tracking-tight" href="/">
        Portfolio<span className="text-accent">.</span>
      </Link>
      <Navigation />
    </aside>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          aria-label="Open dashboard navigation"
          size="icon"
          variant="outline"
        >
          <Menu className="size-5" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay bg-foreground/20 fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content className="sidebar-panel-left bg-background fixed inset-y-0 left-0 z-50 w-[min(88vw,320px)] border-r p-5">
          <div className="mb-10 flex items-center justify-between">
            <Dialog.Title className="font-semibold">Dashboard</Dialog.Title>
            <Dialog.Close asChild>
              <Button
                aria-label="Close dashboard navigation"
                size="icon"
                variant="ghost"
              >
                <X className="size-5" />
              </Button>
            </Dialog.Close>
          </div>
          <Navigation close={() => setOpen(false)} staggerLinks />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
