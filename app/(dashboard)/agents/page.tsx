import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { ClientErrorBoundary } from "@/components/error-boundary";
import { loadSearchParams } from "@/modules/agents/params";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";

interface AgentsPageProps {
  searchParams: Promise<SearchParams>;
}

async function AgentsPageContent({ searchParams }: AgentsPageProps) {
  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    }),
  );

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ClientErrorBoundary>
      </HydrationBoundary>
    </>
  );
}

export default function AgentsPage({ searchParams }: AgentsPageProps) {
  return (
    <Suspense fallback={<AgentsViewLoading />}>
      <AgentsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
