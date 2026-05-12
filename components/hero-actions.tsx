"use client";

import Link from "next/link";
import { Show, useUser } from "@clerk/nextjs";

type HeroActionsProps = {
  className?: string;
};

function HeroActions({ className }: HeroActionsProps) {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const hasDashboardAccess = role === "admin" || role === "seller";
  const dashboardHref = hasDashboardAccess ? "/dashboard" : "/my-payments";

  return (
    <div className={className}>
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className="px-8 py-4 bg-terracotta text-cream rounded-full text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-terracotta/20"
        >
          Comenzar ahora
        </Link>
      </Show>
      <Show when="signed-in">
        <Link
          href={dashboardHref}
          className="px-8 py-4 bg-terracotta text-cream rounded-full text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-terracotta/20"
        >
          Ir al Panel
        </Link>
      </Show>
      <a
        href="#features"
        className="px-8 py-4 border border-cream/30 text-cream rounded-full text-sm font-medium hover:bg-cream/10 transition-all backdrop-blur-sm"
      >
        Conocer más
      </a>
    </div>
  );
}

export { HeroActions };
