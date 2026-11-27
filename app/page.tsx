import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function HomeContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border/70 bg-card/95 shadow-xl shadow-rose-950/10 ring-1 ring-primary/10 backdrop-blur-sm dark:shadow-black/40">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome, {session.user.name}
        </CardTitle>
        <CardDescription>You are signed in to YouMeet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/40 p-3 text-sm">
          <p>
            <span className="font-medium">Name:</span> {session.user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-50 via-background to-rose-50/70 p-4 dark:from-stone-950 dark:via-background dark:to-rose-950/25">
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>
    </div>
  );
}
