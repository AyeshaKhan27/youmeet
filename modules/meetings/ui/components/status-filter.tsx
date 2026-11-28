"use client";

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";
import { CommandSelect } from "@/components/command-select";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { MeetingStatus } from "@/modules/meetings/types";

const options = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon className="size-4 text-amber-600" />
        Upcoming
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon className="size-4 text-emerald-600" />
        Completed
      </div>
    ),
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon className="size-4 text-blue-600" />
        Active
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon className="size-4 text-primary" />
        Processing
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon className="size-4 text-rose-600" />
        Cancelled
      </div>
    ),
  },
];

export function StatusFilter() {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <CommandSelect
      placeholder="Status"
      className="h-9 bg-card shadow-xs"
      options={options}
      onSelect={(value) =>
        setFilters({
          status: value as MeetingStatus,
          page: DEFAULT_PAGE,
        })
      }
      value={filters.status ?? ""}
    />
  );
}
