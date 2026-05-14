"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalLoading from "@/app/loading";

export function ClientRedirect({ url }: { url: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(url);
  }, [url, router]);

  return <GlobalLoading />;
}
