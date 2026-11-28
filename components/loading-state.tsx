import { Loader2Icon } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
}

export function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center justify-center gap-y-5 rounded-2xl border border-border/70 bg-card/95 p-10 text-center shadow-md shadow-rose-950/5 ring-1 ring-primary/10">
        <Loader2Icon className="size-7 animate-spin text-primary" />
        <div className="flex flex-col gap-y-1.5">
          <h6 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h6>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
