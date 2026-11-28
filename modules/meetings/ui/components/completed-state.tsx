"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";
import type { MeetingGetOne } from "@/modules/meetings/types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CompletedStateProps {
  data: MeetingGetOne;
}

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "No duration";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function CompletedState({ data }: CompletedStateProps) {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="rounded-2xl border border-border/70 bg-card/95 px-3 py-2 shadow-sm">
          <TabsList className="h-10 bg-transparent p-0">
            <TabsTrigger value="summary" className="gap-1.5">
              <BookOpenTextIcon className="size-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="transcript" className="gap-1.5">
              <FileTextIcon className="size-4" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="recording" className="gap-1.5">
              <VideoIcon className="size-4" />
              Recording
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-1.5">
              <SparklesIcon className="size-4" />
              Ask AI
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary">
          <div className="rounded-2xl border border-border/70 bg-card/95 p-6 shadow-md shadow-rose-950/5 ring-1 ring-primary/10">
            <div className="flex flex-col gap-y-5">
              <h2 className="text-2xl font-semibold capitalize text-foreground">
                {data.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 font-medium capitalize text-foreground underline-offset-4 hover:underline"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-6 border border-border/70"
                  />
                  {data.agent.name}
                </Link>
                {data.startedAt && (
                  <span>{format(new Date(data.startedAt), "PPP")}</span>
                )}
                <Badge variant="outline" className="gap-x-1.5">
                  <ClockFadingIcon className="size-3.5 text-primary" />
                  {formatDuration(data.duration)}
                </Badge>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-foreground/90">
                {data.summary || "No summary available yet for this meeting."}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transcript">
          <div className="rounded-2xl border border-border/70 bg-card/95 p-6 text-sm text-muted-foreground shadow-sm">
            {data.transcriptUrl ? (
              <a
                href={data.transcriptUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                View Transcript
              </a>
            ) : (
              "Transcript will appear here once available."
            )}
          </div>
        </TabsContent>

        <TabsContent value="recording">
          <div className="rounded-2xl border border-border/70 bg-card/95 p-6 text-sm text-muted-foreground shadow-sm">
            {data.recordingUrl ? (
              <video
                src={data.recordingUrl}
                className="w-full rounded-xl"
                controls
              />
            ) : (
              "No recording available yet for this meeting."
            )}
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <div className="rounded-2xl border border-border/70 bg-card/95 p-6 text-sm text-muted-foreground shadow-sm">
            Ask AI about this meeting once transcript processing is connected.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
