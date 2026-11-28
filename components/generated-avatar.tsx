"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";
import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant?: "botttsNeutral" | "initials";
}

export function GeneratedAvatar({
  seed,
  className,
  variant = "initials",
}: GeneratedAvatarProps) {
  const avatarUri = useMemo(() => {
    const avatar =
      variant === "botttsNeutral"
        ? createAvatar(botttsNeutral, { seed })
        : createAvatar(initials, {
            seed,
            fontWeight: 500,
            fontSize: 42,
          });

    return avatar.toDataUri();
  }, [seed, variant]);

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatarUri} alt={seed} />
      <AvatarFallback>{seed.charAt(0).toUpperCase() || "U"}</AvatarFallback>
    </Avatar>
  );
}
