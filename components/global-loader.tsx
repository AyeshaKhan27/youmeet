"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

function isPrefetchRequest(input: RequestInfo | URL, init?: RequestInit): boolean {
  const headers = init?.headers;
  if (headers) {
    if (headers instanceof Headers) {
      if (headers.has("Next-Router-Prefetch")) return true;
    } else if (Array.isArray(headers)) {
      if (headers.some(([k]) => k.toLowerCase() === "next-router-prefetch")) {
        return true;
      }
    } else if (
      Object.keys(headers).some(
        (k) => k.toLowerCase() === "next-router-prefetch",
      )
    ) {
      return true;
    }
  }

  if (input instanceof Request && input.headers.has("Next-Router-Prefetch")) {
    return true;
  }

  return false;
}

export function GlobalLoader() {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (isPrefetchRequest(input, init)) {
        return originalFetch(input, init);
      }

      setActiveRequests((count) => count + 1);
      try {
        return await originalFetch(input, init);
      } finally {
        setActiveRequests((count) => Math.max(0, count - 1));
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (activeRequests === 0) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-xs"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card px-6 py-5 shadow-xl shadow-rose-950/10 ring-1 ring-primary/15">
        <Loader2Icon className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">Please wait...</p>
      </div>
    </div>
  );
}
