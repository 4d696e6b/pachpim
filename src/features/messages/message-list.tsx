"use client";

import { Archive, Check, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  deleteMessage,
  updateMessageStatus,
} from "@/features/messages/actions";
import { formatDate } from "@/lib/utils";

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

export function MessageList({ messages }: { messages: MessageItem[] }) {
  const [pending, startTransition] = useTransition();

  function status(id: string, value: "read" | "archived") {
    startTransition(async () => {
      try {
        await updateMessageStatus(id, value);
        toast.success(
          value === "read" ? "Marked as read." : "Message archived.",
        );
      } catch {
        toast.error("Message could not be updated.");
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      try {
        await deleteMessage(id);
        toast.success("Message deleted.");
      } catch {
        toast.error("Message could not be deleted.");
      }
    });
  }

  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <Card
          className={message.status === "unread" ? "border-accent/35" : ""}
          key={message.id}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold">{message.subject}</h2>
                  {message.status === "unread" ? (
                    <span className="bg-accent/10 text-accent rounded-full px-2 py-1 text-xs font-medium">
                      New
                    </span>
                  ) : null}
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {message.name} ·{" "}
                  <a
                    className="hover:text-foreground"
                    href={`mailto:${message.email}`}
                  >
                    {message.email}
                  </a>{" "}
                  · {formatDate(message.createdAt)}
                </p>
                <p className="mt-5 text-sm leading-7 whitespace-pre-wrap">
                  {message.message}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {message.status === "unread" ? (
                  <Button
                    aria-label="Mark as read"
                    disabled={pending}
                    onClick={() => status(message.id, "read")}
                    size="icon"
                    variant="ghost"
                  >
                    <Check className="size-4" />
                  </Button>
                ) : null}
                {message.status !== "archived" ? (
                  <Button
                    aria-label="Archive message"
                    disabled={pending}
                    onClick={() => status(message.id, "archived")}
                    size="icon"
                    variant="ghost"
                  >
                    <Archive className="size-4" />
                  </Button>
                ) : null}
                <ConfirmDialog
                  description="This permanently removes the contact submission."
                  onConfirm={() => remove(message.id)}
                  title="Delete this message?"
                  trigger={
                    <Button
                      aria-label="Delete message"
                      disabled={pending}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
