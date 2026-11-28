"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react";
import { cn } from "cn";
import type { MeetingGetMany } from "@/modules/meetings/types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "No duration";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-400",
  active: "bg-blue-500/10 text-blue-700 border-blue-500/25 dark:text-blue-400",
  completed:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
  processing:
    "bg-primary/10 text-primary border-primary/25",
  cancelled:
    "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:text-rose-400",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize text-foreground">
          {row.original.name}
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-x-1.5">
            <CornerDownRightIcon className="size-3.5 shrink-0" />
            <span className="max-w-[160px] truncate capitalize sm:max-w-[220px]">
              {row.original.agent.name}
            </span>
          </div>
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-4 border border-border/60"
          />
          {row.original.startedAt && (
            <span>{format(new Date(row.original.startedAt), "MMM d")}</span>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-3.5",
            statusColorMap[
              row.original.status as keyof typeof statusColorMap
            ],
          )}
        >
          <Icon
            className={cn(
              row.original.status === "processing" && "animate-spin",
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-right">Duration</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-x-2">
        <Badge
          variant="outline"
          className="flex items-center gap-x-1.5 border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium [&>svg]:size-3.5"
        >
          <ClockFadingIcon className="text-primary" />
          <span>{formatDuration(row.original.duration)}</span>
        </Badge>
        <ChevronRightIcon className="hidden size-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground sm:block" />
      </div>
    ),
  },
];
