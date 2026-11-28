"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";

export function AgentIdFilter() {
  const [filters, setFilters] = useMeetingsFilters();
  const [agentSearch, setAgentSearch] = useState("");

  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentSearch,
    }),
  );

  return (
    <CommandSelect
      className="h-9 bg-card shadow-xs"
      placeholder="Agent"
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4"
            />
            <span className="truncate">{agent.name}</span>
          </div>
        ),
      }))}
      onSelect={(value) =>
        setFilters({
          agentId: value,
          page: DEFAULT_PAGE,
        })
      }
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
    />
  );
}
