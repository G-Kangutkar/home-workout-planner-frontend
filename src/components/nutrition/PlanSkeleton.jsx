import { Skeleton } from "@/components/ui/skeleton.jsx";
export default function PlanSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <Skeleton className="h-16 w-full rounded-2xl bg-zinc-800" />
      <Skeleton className="h-36 w-full rounded-2xl bg-zinc-800" />
      <Skeleton className="h-5 w-32 rounded bg-zinc-800" />
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-2xl bg-zinc-800" />
      ))}
    </div>
  );
}