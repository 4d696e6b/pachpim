import { ArrowDownRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

export function CollectionHeading({
  eyebrow,
  title,
  description,
  count,
  unit,
}: {
  eyebrow: string;
  title: string;
  description: string;
  count: number;
  unit: string;
}) {
  return (
    <Reveal>
      <header className="collection-heading relative overflow-hidden border-b pb-12 sm:pb-16">
        <div className="relative z-10">
          <p className="eyebrow flex items-center gap-3">
            <span className="bg-accent h-px w-8" />
            {eyebrow}
          </p>
          <div className="mt-7 flex items-end justify-between gap-6">
            <h1 className="page-title max-w-3xl">{title}</h1>
            <ArrowDownRight
              className="text-accent hidden size-16 shrink-0 sm:block"
              strokeWidth={1}
            />
          </div>
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
            {description}
          </p>
          <p className="text-muted-foreground mt-8 font-mono text-xs">
            <span className="text-accent">
              {String(count).padStart(2, "0")}
            </span>{" "}
            {unit} · Always learning, always building
          </p>
        </div>
      </header>
    </Reveal>
  );
}
