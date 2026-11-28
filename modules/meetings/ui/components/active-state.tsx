import Link from "next/link";
import { VideoIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

interface ActiveStateProps {
  meetingId: string;
}

export function ActiveState({ meetingId }: ActiveStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 rounded-2xl border border-border/70 bg-card/95 px-5 py-10 shadow-md shadow-rose-950/5 ring-1 ring-primary/10">
      <div className="w-full max-w-md [&>div]:border-none [&>div]:bg-transparent [&>div]:py-4 [&>div]:shadow-none">
        <EmptyState
          title="Meeting is active"
          description="Meeting will end once all participants have left."
        />
      </div>

      <Link
        href={`/call/${meetingId}`}
        className={buttonVariants({
          className: "w-full gap-2 shadow-sm shadow-primary/25 sm:w-auto",
        })}
      >
        <VideoIcon className="size-4" />
        Join meeting
      </Link>
    </div>
  );
}
