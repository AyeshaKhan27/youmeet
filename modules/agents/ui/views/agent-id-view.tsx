"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";
import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { AgentIdViewHeader } from "@/modules/agents/ui/components/agent-id-view-header";
import { UpdateAgentDialog } from "@/modules/agents/ui/components/update-agent-dialog";

interface AgentIdViewProps {
  agentId: string;
}

export function AgentIdView({ agentId }: AgentIdViewProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        toast.add({
          title: "Agent deleted",
          description: `"${data.name}" has been removed.`,
          type: "success",
        });
        router.push("/agents");
      },
      onError: (error) => {
        toast.add({
          title: "Failed to delete agent",
          description: error.message,
          type: "error",
        });
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `This action will permanently delete "${data.name}" and remove its ${data.meetingCount} associated meetings.`,
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />
      <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-y-5">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />

        <div className="rounded-2xl border border-border/70 bg-card/95 p-5 shadow-md shadow-rose-950/5 ring-1 ring-primary/10 sm:p-6">
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-x-3">
                <GeneratedAvatar
                  variant="botttsNeutral"
                  seed={data.name}
                  className="size-11 shrink-0 border border-border/70 sm:size-12"
                />
                <h2 className="text-xl font-semibold tracking-tight capitalize text-foreground sm:text-2xl">
                  {data.name}
                </h2>
              </div>

              <Badge
                variant="outline"
                className="flex w-fit items-center gap-x-2 border-primary/15 bg-primary/5 px-3 py-1 [&>svg]:size-4"
              >
                <VideoIcon className="text-primary" />
                <span>
                  {data.meetingCount}{" "}
                  {data.meetingCount === 1 ? "meeting" : "meetings"}
                </span>
              </Badge>
            </div>

            <div className="flex flex-col gap-y-2 rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Instructions
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {data.instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AgentIdViewLoading() {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds..."
    />
  );
}

export function AgentIdViewError() {
  return (
    <ErrorState
      title="Error Loading Agent"
      description="Something went wrong while loading this agent."
    />
  );
}
