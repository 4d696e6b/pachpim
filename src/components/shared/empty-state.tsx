import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="flex min-h-64 flex-col items-center justify-center border-dashed p-8 text-center">
      <div className="bg-muted grid size-12 place-items-center rounded-2xl">
        <Icon className="text-muted-foreground size-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}
