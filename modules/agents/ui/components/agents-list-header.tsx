"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";
import { Button } from "@/components/ui/button";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { AgentsSearchFilter } from "@/modules/agents/ui/components/agents-search-filter";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

export function AgentsListHeader() {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="mx-auto mb-6 flex max-w-6xl flex-col gap-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              My Agents
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your AI meeting agents and their instructions.
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-10 w-full gap-1.5 font-medium shadow-sm shadow-primary/25 sm:w-auto"
          >
            <PlusIcon className="size-4" />
            New Agent
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AgentsSearchFilter />
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
      </div>
    </>
  );
}
