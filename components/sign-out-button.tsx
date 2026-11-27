"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      toast.add({
        title: "Signed out",
        description: "You have been signed out.",
        type: "success",
      });
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      toast.add({
        title: "Sign out failed",
        description:
          err instanceof Error ? err.message : "Something went wrong.",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="h-10 w-full gap-2 font-medium"
      disabled={loading}
      onClick={handleSignOut}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="size-4" />
          Sign Out
        </>
      )}
    </Button>
  );
}
