import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { ClientErrorBoundary } from "@/components/error-boundary";
import {
  MeetingIdView,
  MeetingIdViewError,
  MeetingIdViewLoading,
} from "@/modules/meetings/ui/views/meeting-id-view";

interface MeetingIdPageProps {
  params: Promise<{ meetingId: string }>;
}

async function MeetingIdPageContent({ params }: MeetingIdPageProps) {
  const { meetingId } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientErrorBoundary fallback={<MeetingIdViewError />}>
        <MeetingIdView meetingId={meetingId} />
      </ClientErrorBoundary>
    </HydrationBoundary>
  );
}

export default function MeetingIdPage({ params }: MeetingIdPageProps) {
  return (
    <Suspense fallback={<MeetingIdViewLoading />}>
      <MeetingIdPageContent params={params} />
    </Suspense>
  );
}
