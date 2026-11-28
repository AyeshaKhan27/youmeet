"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronRightIcon,
  CornerDownRightIcon,
  VideoIcon,
} from "lucide-react";
import type { AgentGetMany } from "@/modules/agents/types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        <GeneratedAvatar
          variant="botttsNeutral"
          seed={row.original.name}
          className="size-9 shrink-0 border border-border/70 sm:size-10"
        />
        <div className="flex min-w-0 flex-col gap-y-0.5">
          <span className="truncate font-semibold capitalize text-foreground">
            {row.original.name}
          </span>
          <div className="flex items-center gap-x-1.5 text-muted-foreground">
            <CornerDownRightIcon className="size-3.5 shrink-0" />
            <span className="max-w-[170px] truncate text-xs sm:max-w-[300px] md:max-w-[440px]">
              {row.original.instructions}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: () => <div className="text-right">Meetings</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-x-2">
        <Badge
          variant="outline"
          className="flex items-center gap-x-1.5 border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium [&>svg]:size-3.5"
        >
          <VideoIcon className="text-primary" />
          <span>
            {row.original.meetingCount}{" "}
            <span className="hidden sm:inline">
              {row.original.meetingCount === 1 ? "meeting" : "meetings"}
            </span>
          </span>
        </Badge>
        <ChevronRightIcon className="hidden size-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground sm:block" />
      </div>
    ),
  },
];
