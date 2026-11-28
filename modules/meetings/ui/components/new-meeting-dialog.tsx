"use client";

import { useRouter } from "next/navigation";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "@/modules/meetings/ui/components/meeting-form";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMeetingDialog({ open, onOpenChange }: NewMeetingDialogProps) {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new meeting with an AI agent."
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          if (id) {
            router.push(`/meetings/${id}`);
          }
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
