import { EmptyState } from "@/components/empty-state";

export function CancelledState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/95 px-5 py-10 shadow-md shadow-rose-950/5 ring-1 ring-primary/10">
      <div className="w-full max-w-md [&>div]:border-none [&>div]:bg-transparent [&>div]:py-4 [&>div]:shadow-none">
        <EmptyState
          title="Meeting cancelled"
          description="This meeting was cancelled."
        />
      </div>
    </div>
  );
}
