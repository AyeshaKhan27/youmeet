"use client";

import Link from "next/link";
import {
  ChevronRightIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MeetingIdViewHeaderProps {
  meetingId: string;
  meetingName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export function MeetingIdViewHeader({
  meetingName,
  onEdit,
  onRemove,
}: MeetingIdViewHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/meetings" />}
              className="text-base font-medium text-muted-foreground hover:text-foreground"
            >
              My Meetings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base font-semibold text-foreground">
              {meetingName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Meeting actions" />
          }
        >
          <MoreVerticalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <PencilIcon className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <TrashIcon className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
