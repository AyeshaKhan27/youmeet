import { AlertCircleIcon } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center justify-center gap-y-5 rounded-2xl border border-destructive/20 bg-card/95 p-10 text-center shadow-md shadow-rose-950/5">
        <AlertCircleIcon className="size-7 text-destructive" />
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
