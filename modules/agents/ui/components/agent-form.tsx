"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { cn } from "cn";
import { useTRPC } from "@/trpc/client";
import { agentsInsertSchema } from "@/modules/agents/schemas";
import type { AgentGetOne } from "@/modules/agents/types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

type FieldErrors = {
  name?: string;
  instructions?: string;
};

export function AgentForm({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [instructions, setInstructions] = useState(
    initialValues?.instructions ?? "",
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isEdit = Boolean(initialValues?.id);

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        toast.add({
          title: "Agent created",
          description: `"${name.trim()}" is ready to join your meetings.`,
          type: "success",
        });
        onSuccess?.();
      },
      onError: (error) => {
        toast.add({
          title: "Failed to create agent",
          description: error.message,
          type: "error",
        });
      },
    }),
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        toast.add({
          title: "Agent updated",
          description: `"${name.trim()}" has been updated.`,
          type: "success",
        });
        onSuccess?.();
      },
      onError: (error) => {
        toast.add({
          title: "Failed to update agent",
          description: error.message,
          type: "error",
        });
      },
    }),
  );

  const isPending = createAgent.isPending || updateAgent.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = agentsInsertSchema.safeParse({ name, instructions });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const errors: FieldErrors = {
        name: flat.name?.[0],
        instructions: flat.instructions?.[0],
      };
      setFieldErrors(errors);
      toast.add({
        title: "Missing required fields",
        description:
          errors.name ?? errors.instructions ?? "Please fill in all fields.",
        type: "error",
      });
      return;
    }

    setFieldErrors({});

    if (isEdit && initialValues?.id) {
      updateAgent.mutate({
        id: initialValues.id,
        ...parsed.data,
      });
    } else {
      createAgent.mutate(parsed.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="flex items-center gap-3">
        <GeneratedAvatar
          seed={name.trim() || "Agent"}
          variant="botttsNeutral"
          className="size-16 border border-border/70"
        />
        <div className="text-xs text-muted-foreground">
          Avatar updates automatically as you type the agent&apos;s name.
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="agent-name"
          className={cn(fieldErrors.name && "text-destructive")}
        >
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="agent-name"
          placeholder="e.g. Math Tutor"
          aria-invalid={!!fieldErrors.name}
          className={cn(
            "h-10",
            fieldErrors.name &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
          )}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) {
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          disabled={isPending}
        />
        {fieldErrors.name && (
          <p className="text-xs text-destructive">{fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="agent-instructions"
          className={cn(fieldErrors.instructions && "text-destructive")}
        >
          Instructions <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="agent-instructions"
          placeholder="You are a helpful math assistant that can answer questions and help with assignments."
          rows={4}
          aria-invalid={!!fieldErrors.instructions}
          className={cn(
            fieldErrors.instructions &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
          )}
          value={instructions}
          onChange={(e) => {
            setInstructions(e.target.value);
            if (fieldErrors.instructions) {
              setFieldErrors((prev) => ({
                ...prev,
                instructions: undefined,
              }));
            }
          }}
          disabled={isPending}
        />
        {fieldErrors.instructions && (
          <p className="text-xs text-destructive">{fieldErrors.instructions}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
}
