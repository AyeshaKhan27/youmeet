"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";
import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";

export function MeetingsSearchFilter() {
  const [filters, setFilters] = useMeetingsFilters();
  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (searchValue === filters.search) return;

    const timer = setTimeout(() => {
      setFilters({
        search: searchValue,
        page: DEFAULT_PAGE,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, setFilters]);

  return (
    <div className="relative w-full sm:w-64">
      <Input
        placeholder="Search meetings by name..."
        className="h-9 w-full bg-card pl-8.5 shadow-xs"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
