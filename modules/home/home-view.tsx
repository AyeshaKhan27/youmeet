"use client";

import { Calendar, Plus, UserCheck, Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HomeViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function HomeView({ user }: HomeViewProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome back, {user.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Start an instant meeting, join a room, or manage your AI agents.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-md shadow-rose-950/5 ring-1 ring-primary/10 transition-shadow hover:shadow-lg hover:shadow-rose-950/10">
          <CardHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <Plus className="size-5" />
            </div>
            <CardTitle className="text-lg">New Meeting</CardTitle>
            <CardDescription>
              Create an instant room and invite participants with a link.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-md shadow-rose-950/5 ring-1 ring-primary/10 transition-shadow hover:shadow-lg hover:shadow-rose-950/10">
          <CardHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Video className="size-5" />
            </div>
            <CardTitle className="text-lg">Join Meeting</CardTitle>
            <CardDescription>
              Enter a meeting code or link to join an active session.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/95 shadow-md shadow-rose-950/5 ring-1 ring-primary/10 transition-shadow hover:shadow-lg hover:shadow-rose-950/10 sm:col-span-2 lg:col-span-1">
          <CardHeader className="space-y-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Calendar className="size-5" />
            </div>
            <CardTitle className="text-lg">Schedule</CardTitle>
            <CardDescription>
              Plan upcoming meetings and keep your calendar organized.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <Card className="rounded-2xl border-border/70 bg-card/95 shadow-md shadow-rose-950/5 ring-1 ring-primary/10">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserCheck className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base">Account Session</CardTitle>
            <CardDescription>
              Currently authenticated as {user.email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-medium text-foreground">{user.name}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{user.email}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">User ID</p>
            <p className="truncate font-mono text-xs text-foreground">
              {user.id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
