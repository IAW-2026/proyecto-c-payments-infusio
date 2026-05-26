"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
}

export function BackButton({ label = "Volver" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-brown/50 hover:text-olive transition-colors mb-8 cursor-pointer appearance-none bg-transparent border-none p-0"
    >
      <ArrowLeft size={14} />
      {label}
    </button>
  );
}
