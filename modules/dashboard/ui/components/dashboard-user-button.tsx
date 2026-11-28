"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface DashboardUserButtonProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function DashboardUserButton({ user }: DashboardUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initial = user.name?.charAt(0).toUpperCase() || "U";

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
    <SidebarMenu className="gap-2">
      <SidebarMenuItem>
        <div className="flex items-center gap-2.5 rounded-xl border border-sidebar-border/80 bg-sidebar-accent/40 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          {user.image ? (
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                {initial}
              </AvatarFallback>
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={user.name}
              variant="lorelei"
              className="size-8 shrink-0"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/65">
              {user.email}
            </span>
          </div>
        </div>
      </SidebarMenuItem>

      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenuButton
          onClick={handleSignOut}
          disabled={loading}
          tooltip="Logout"
          className="h-9 cursor-pointer rounded-lg border border-sidebar-border/70 bg-sidebar-accent/30 px-3 font-medium text-sidebar-foreground/90 transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          {loading ? (
            <Loader2Icon className="size-4 shrink-0 animate-spin" />
          ) : (
            <LogOutIcon className="size-4 shrink-0" />
          )}
          <span className="group-data-[collapsible=icon]:hidden">
            {loading ? "Logging out..." : "Logout"}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
