import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-5 text-base leading-7 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
