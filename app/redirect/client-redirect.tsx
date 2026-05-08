"use client";

import { useEffect } from "react";

export function ClientRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <div className="flex h-screen items-center justify-center bg-cream">
      <p className="text-brown/50 text-sm animate-pulse">Redirecting...</p>
    </div>
  );
}
