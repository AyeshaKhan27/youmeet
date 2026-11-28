"use client";

import { useEffect } from "react";
import { RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentIdViewError } from "@/modules/agents/ui/views/agent-id-view";

export default function AgentIdError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <AgentIdViewError />
      <Button
        type="button"
        variant="outline"
        onClick={reset}
        className="gap-2"
      >
        <RotateCcwIcon className="size-4" />
        Try again
      </Button>
    </div>
  );
}
