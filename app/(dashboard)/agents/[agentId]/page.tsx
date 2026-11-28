import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { ClientErrorBoundary } from "@/components/error-boundary";
import {
  AgentIdView,
  AgentIdViewError,
  AgentIdViewLoading,
} from "@/modules/agents/ui/views/agent-id-view";

interface AgentIdPageProps {
  params: Promise<{ agentId: string }>;
}

async function AgentIdPageContent({ params }: AgentIdPageProps) {
  const { agentId } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientErrorBoundary fallback={<AgentIdViewError />}>
        <AgentIdView agentId={agentId} />
      </ClientErrorBoundary>
    </HydrationBoundary>
  );
}

export default function AgentIdPage({ params }: AgentIdPageProps) {
  return (
    <Suspense fallback={<AgentIdViewLoading />}>
      <AgentIdPageContent params={params} />
    </Suspense>
  );
}
