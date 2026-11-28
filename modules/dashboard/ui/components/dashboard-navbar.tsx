"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardCommand } from "@/modules/dashboard/ui/components/dashboard-command";

export function DashboardNavbar() {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-md">
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="size-9 shrink-0 border border-border/70 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCommandOpen((open) => !open)}
            className="h-9 w-full max-w-60 justify-start gap-2 font-normal text-muted-foreground"
          >
            <SearchIcon className="size-4 shrink-0" />
            <span className="truncate">Search...</span>
            <kbd className="pointer-events-none ml-auto hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none sm:inline-flex">
              <span className="text-xs">&#8984;</span>K
            </kbd>
          </Button>
        </div>
      </header>
    </>
  );
}
