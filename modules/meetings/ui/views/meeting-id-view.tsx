"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { toast } from "@/components/ui/toast";
import { ActiveState } from "@/modules/meetings/ui/components/active-state";
import { CancelledState } from "@/modules/meetings/ui/components/cancelled-state";
import { CompletedState } from "@/modules/meetings/ui/components/completed-state";
import { MeetingIdViewHeader } from "@/modules/meetings/ui/components/meeting-id-view-header";
import { ProcessingState } from "@/modules/meetings/ui/components/processing-state";
import { UpcomingState } from "@/modules/meetings/ui/components/upcoming-state";
import { UpdateMeetingDialog } from "@/modules/meetings/ui/components/update-meeting-dialog";

interface MeetingIdViewProps {
  meetingId: string;
}

export function MeetingIdView({ meetingId }: MeetingIdViewProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        toast.add({
          title: "Meeting deleted",
          description: `"${data.name}" has been removed.`,
          type: "success",
        });
        router.push("/meetings");
      },
      onError: (error) => {
        toast.add({
          title: "Failed to delete meeting",
          description: error.message,
          type: "error",
        });
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `This action will permanently remove "${data.name}".`,
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-y-5">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />

        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <CompletedState data={data} />}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={handleRemoveMeeting}
            isCancelling={removeMeeting.isPending}
          />
        )}
      </div>
    </>
  );
}

export function MeetingIdViewLoading() {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds..."
    />
  );
}

export function MeetingIdViewError() {
  return (
    <ErrorState
      title="Error Loading Meeting"
      description="Something went wrong while loading this meeting."
    />
  );
}
