"use client";

import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { columns } from "@/modules/agents/ui/components/columns";

export function AgentsView() {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    }),
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-y-4">
      {data.items.length === 0 ? (
        <EmptyState
          title={
            filters.search ? "No matching agents" : "Create your first agent"
          }
          description={
            filters.search
              ? `No agents found matching "${filters.search}". Try clearing your search filter.`
              : "Create an agent to join your meetings. Each agent will follow your instructions and interact with participants during the call."
          }
        />
      ) : (
        <>
          <DataTable
            data={data.items}
            columns={columns}
            onRowClick={(row) => router.push(`/agents/${row.id}`)}
          />
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </>
      )}
    </div>
  );
}

export function AgentsViewLoading() {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds..."
    />
  );
}

export function AgentsViewError() {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong while fetching your agents. Please try again."
    />
  );
}
