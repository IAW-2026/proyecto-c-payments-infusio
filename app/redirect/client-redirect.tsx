"use client";

import { useEffect } from "react";

export function ClientRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return <div className="flex h-screen w-full bg-cream" />;
}
