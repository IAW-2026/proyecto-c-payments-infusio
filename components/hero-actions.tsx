"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";

type HeroActionsProps = {
  className?: string;
};

function HeroActions({ className }: HeroActionsProps) {
  return (
    <div className={className}>
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className="px-6 py-3 bg-olive text-cream rounded-full text-sm font-medium hover:bg-olive/90 transition-colors"
        >
          Get Started
        </Link>
      </Show>
      <Show when="signed-in">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-olive text-cream rounded-full text-sm font-medium hover:bg-olive/90 transition-colors"
        >
          Go to Dashboard
        </Link>
      </Show>
      <a
        href="#features"
        className="px-6 py-3 border border-cream/20 text-cream/80 rounded-full text-sm font-medium hover:bg-cream/5 transition-colors"
      >
        Learn More
      </a>
    </div>
  );
}

export { HeroActions };
