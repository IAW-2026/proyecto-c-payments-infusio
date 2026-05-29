"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  href?: string;
}

export function BackButton({ label = "Volver", href = "/dashboard" }: BackButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      document.referrer &&
      document.referrer.includes(window.location.host)
    ) {
      e.preventDefault();
      window.history.back();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-brown/80 hover:text-olive transition-colors mb-8 cursor-pointer"
    >
      <ArrowLeft size={14} />
      {label}
    </Link>
  );
}
