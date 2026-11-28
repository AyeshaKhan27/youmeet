"use client";

import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { BotIcon, HomeIcon, StarIcon, VideoIcon } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Meetings", href: "/meetings", icon: VideoIcon },
  { label: "Agents", href: "/agents", icon: BotIcon },
  { label: "Upgrade", href: "/upgrade", icon: StarIcon },
];

export function DashboardCommand({ open, setOpen }: DashboardCommandProps) {
  const router = useRouter();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search pages, meetings, or agents..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
              >
                <item.icon className="mr-2 size-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
