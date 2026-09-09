import { Skeleton } from "@/components/ui/form-controls";

export default function Loading() {
  return (
    <main
      className="section container"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-6 h-14 w-full max-w-2xl" />
      <Skeleton className="mt-4 h-6 w-full max-w-xl" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-72" key={index} />
        ))}
      </div>
    </main>
  );
}
