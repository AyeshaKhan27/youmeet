import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-background to-rose-50/70 px-4 py-10 dark:from-stone-950 dark:via-background dark:to-rose-950/25">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
        >
          <Image
            src="/logo.svg"
            alt="YouMeet logo"
            width={36}
            height={36}
            priority
          />
          <span className="text-xl font-semibold tracking-tight text-foreground">
            YouMeet
          </span>
        </Link>

        <div className="w-full">{children}</div>

        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 YouMeet. Secure authentication.
        </p>
      </div>
    </div>
  );
}
