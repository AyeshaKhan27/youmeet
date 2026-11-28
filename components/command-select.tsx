"use client";

import { type ReactNode, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface CommandSelectProps {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
}

export function CommandSelect({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: CommandSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onSearch?.("");
    }
    setOpen(nextOpen);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
        className={cn(
          "h-9 justify-between px-2.5 font-normal",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        <div className="truncate">
          {selectedOption ? selectedOption.children : placeholder}
        </div>
        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-60" />
      </Button>

      <CommandResponsiveDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-xs text-muted-foreground">
              No options found
            </span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                handleOpenChange(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
}
