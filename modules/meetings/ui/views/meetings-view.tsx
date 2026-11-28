"use client";

import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { columns } from "@/modules/meetings/ui/components/columns";

export function MeetingsView() {
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    }),
  );

  const hasFilters = !!filters.search || !!filters.status || !!filters.agentId;

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-y-4">
      {data.items.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No matching meetings" : "Create your first meeting"}
          description={
            hasFilters
              ? "No meetings match your active filters. Try clearing them to see all meetings."
              : "Schedule a meeting to connect with your AI agent and collaborate in real time."
          }
        />
      ) : (
        <>
          <DataTable
            data={data.items}
            columns={columns}
            onRowClick={(row) => router.push(`/meetings/${row.id}`)}
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

export function MeetingsViewLoading() {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds..."
    />
  );
}

export function MeetingsViewError() {
  return (
    <ErrorState
      title="Error Loading Meetings"
      description="Something went wrong while fetching your meetings. Please try again."
    />
  );
}
