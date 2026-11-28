"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { AgentIdFilter } from "@/modules/meetings/ui/components/agent-id-filter";
import { MeetingsSearchFilter } from "@/modules/meetings/ui/components/meetings-search-filter";
import { NewMeetingDialog } from "@/modules/meetings/ui/components/new-meeting-dialog";
import { StatusFilter } from "@/modules/meetings/ui/components/status-filter";

export function MeetingsListHeader() {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="mx-auto mb-6 flex max-w-6xl flex-col gap-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              My Meetings
            </h1>
            <p className="text-sm text-muted-foreground">
              Schedule, manage, and review your AI-powered meetings.
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-10 w-full gap-1.5 font-medium shadow-sm shadow-primary/25 sm:w-auto"
          >
            <PlusIcon className="size-4" />
            New Meeting
          </Button>
        </div>

        <ScrollArea>
          <div className="flex flex-wrap items-center gap-2 p-0.5">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="h-9 gap-1.5"
              >
                <XCircleIcon className="size-4" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
