import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { ClientErrorBoundary } from "@/components/error-boundary";
import { loadSearchParams } from "@/modules/meetings/params";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import {
  MeetingsView,
  MeetingsViewError,
  MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";

interface MeetingsPageProps {
  searchParams: Promise<SearchParams>;
}

async function MeetingsPageContent({ searchParams }: MeetingsPageProps) {
  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    }),
  );

  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientErrorBoundary fallback={<MeetingsViewError />}>
          <MeetingsView />
        </ClientErrorBoundary>
      </HydrationBoundary>
    </>
  );
}

export default function MeetingsPage({ searchParams }: MeetingsPageProps) {
  return (
    <Suspense fallback={<MeetingsViewLoading />}>
      <MeetingsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
