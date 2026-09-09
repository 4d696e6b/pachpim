import { Inbox } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  MessageList,
  type MessageItem,
} from "@/features/messages/message-list";
import { getAdminFirestore } from "@/lib/server/firebase-admin";

const statuses = ["all", "unread", "read", "archived"] as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const requested = (await searchParams).status;
  const status = statuses.includes(requested as (typeof statuses)[number])
    ? requested!
    : "all";
  let query: FirebaseFirestore.Query =
    getAdminFirestore().collection("messages");
  if (status !== "all") query = query.where("status", "==", status);
  const snapshot = await query.orderBy("createdAt", "desc").get();
  const messages = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: data.status,
      createdAt:
        data.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
    } as MessageItem;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <p className="eyebrow">Inbox</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Messages</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Button
            asChild
            key={item}
            size="sm"
            variant={status === item ? "default" : "outline"}
          >
            <Link
              href={
                item === "all"
                  ? "/admin/messages"
                  : `/admin/messages?status=${item}`
              }
            >
              {item[0].toUpperCase() + item.slice(1)}
            </Link>
          </Button>
        ))}
      </div>
      <div className="mt-8">
        {messages.length ? (
          <MessageList messages={messages} />
        ) : (
          <EmptyState
            description="Contact submissions matching this filter will appear here."
            icon={Inbox}
            title="No messages"
          />
        )}
      </div>
    </div>
  );
}
