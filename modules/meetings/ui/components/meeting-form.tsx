"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { cn } from "cn";
import { MAX_PAGE_SIZE } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { meetingsInsertSchema } from "@/modules/meetings/schemas";
import type { MeetingGetOne } from "@/modules/meetings/types";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

type FieldErrors = {
  name?: string;
  agentId?: string;
};

export function MeetingForm({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [agentId, setAgentId] = useState(initialValues?.agentId ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentSearch,
    }),
  );

  const isEdit = Boolean(initialValues?.id);

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        toast.add({
          title: "Meeting created",
          description: `"${name.trim()}" is scheduled.`,
          type: "success",
        });
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.add({
          title: "Failed to create meeting",
          description: error.message,
          type: "error",
        });
      },
    }),
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        toast.add({
          title: "Meeting updated",
          description: `"${name.trim()}" has been updated.`,
          type: "success",
        });
        onSuccess?.();
      },
      onError: (error) => {
        toast.add({
          title: "Failed to update meeting",
          description: error.message,
          type: "error",
        });
      },
    }),
  );

  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = meetingsInsertSchema.safeParse({ name, agentId });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const errors: FieldErrors = {
        name: flat.name?.[0],
        agentId: flat.agentId?.[0],
      };
      setFieldErrors(errors);
      toast.add({
        title: "Missing required fields",
        description:
          errors.name ?? errors.agentId ?? "Please fill in all fields.",
        type: "error",
      });
      return;
    }

    setFieldErrors({});

    if (isEdit && initialValues?.id) {
      updateMeeting.mutate({
        id: initialValues.id,
        ...parsed.data,
      });
    } else {
      createMeeting.mutate(parsed.data);
    }
  };

  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="meeting-name"
            className={cn(fieldErrors.name && "text-destructive")}
          >
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="meeting-name"
            placeholder="e.g. Math Consultations"
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
          <Label className={cn(fieldErrors.agentId && "text-destructive")}>
            Agent <span className="text-destructive">*</span>
          </Label>
          <CommandSelect
            className={cn(
              "h-10 w-full",
              fieldErrors.agentId && "border-destructive",
            )}
            options={(agents.data?.items ?? []).map((agent) => ({
              id: agent.id,
              value: agent.id,
              children: (
                <div className="flex items-center gap-x-2">
                  <GeneratedAvatar
                    seed={agent.name}
                    variant="botttsNeutral"
                    className="size-6 border border-border/60"
                  />
                  <span>{agent.name}</span>
                </div>
              ),
            }))}
            onSelect={(value) => {
              setAgentId(value);
              if (fieldErrors.agentId) {
                setFieldErrors((prev) => ({ ...prev, agentId: undefined }));
              }
            }}
            onSearch={setAgentSearch}
            value={agentId}
            placeholder="Select an agent"
          />
          {fieldErrors.agentId && (
            <p className="text-xs text-destructive">{fieldErrors.agentId}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Not found what you&apos;re looking for?{" "}
            <button
              type="button"
              className="font-medium text-primary underline-offset-4 hover:underline"
              onClick={() => setOpenNewAgentDialog(true)}
            >
              Create new agent
            </button>
          </p>
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
    </>
  );
}
