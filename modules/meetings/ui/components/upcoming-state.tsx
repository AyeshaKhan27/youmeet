"use client";

import Link from "next/link";
import { BanIcon, VideoIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

interface UpcomingStateProps {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling: boolean;
}

export function UpcomingState({
  meetingId,
  onCancelMeeting,
  isCancelling,
}: UpcomingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 rounded-2xl border border-border/70 bg-card/95 px-5 py-10 shadow-md shadow-rose-950/5 ring-1 ring-primary/10">
      <div className="w-full max-w-md [&>div]:border-none [&>div]:bg-transparent [&>div]:py-4 [&>div]:shadow-none">
        <EmptyState
          title="Not started yet"
          description="Once you start this meeting, a summary will appear here."
        />
      </div>

      <div className="flex w-full flex-col-reverse items-center justify-center gap-2.5 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2 sm:w-auto"
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon className="size-4" />
          Cancel meeting
        </Button>

        <Link
          href={`/call/${meetingId}`}
          className={buttonVariants({
            className: "w-full gap-2 shadow-sm shadow-primary/25 sm:w-auto",
          })}
        >
          <VideoIcon className="size-4" />
          Start meeting
        </Link>
      </div>
    </div>
  );
}
