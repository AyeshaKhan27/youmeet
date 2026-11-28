import { BotIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/70 px-6 py-14 text-center shadow-sm">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
        <BotIcon className="size-7" />
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-y-1.5">
        <h6 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
