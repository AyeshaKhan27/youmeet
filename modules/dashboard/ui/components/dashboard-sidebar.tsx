"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BotIcon, HomeIcon, StarIcon, VideoIcon } from "lucide-react";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const primaryNav = [
  {
    icon: HomeIcon,
    label: "Home",
    href: "/",
  },
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondaryNav = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

interface DashboardSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 pt-4 pb-2 group-data-[collapsible=icon]:px-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-1 transition-opacity hover:opacity-90 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/95 p-1 shadow-sm">
            <Image
              src="/logo.svg"
              alt="YouMeet logo"
              width={24}
              height={24}
              priority
            />
          </div>
          <span className="truncate text-xl font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            YouMeet
          </span>
        </Link>
      </SidebarHeader>

      <div className="px-4 py-2">
        <SidebarSeparator className="mx-0" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {primaryNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className="h-10 rounded-lg px-3 font-medium transition-colors data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/35 data-[active=true]:to-sidebar-accent/70 data-[active=true]:text-white data-[active=true]:ring-1 data-[active=true]:ring-white/15"
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-1">
          <SidebarSeparator className="mx-0" />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {secondaryNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className="h-10 rounded-lg px-3 font-medium transition-colors data-[active=true]:bg-gradient-to-r data-[active=true]:from-sidebar-primary/35 data-[active=true]:to-sidebar-accent/70 data-[active=true]:text-white data-[active=true]:ring-1 data-[active=true]:ring-white/15"
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <DashboardUserButton user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
