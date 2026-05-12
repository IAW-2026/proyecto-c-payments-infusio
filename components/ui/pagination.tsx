"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`p-2 rounded-full border border-tan transition-colors ${
          currentPage <= 1
            ? "opacity-30 pointer-events-none"
            : "hover:bg-tan/20 text-brown"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isCurrent = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                isCurrent
                  ? "bg-brown text-cream shadow-md scale-110"
                  : "text-muted-foreground hover:text-brown hover:bg-tan/10"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link
        href={createPageURL(currentPage + 1)}
        className={`p-2 rounded-full border border-tan transition-colors ${
          currentPage >= totalPages
            ? "opacity-30 pointer-events-none"
            : "hover:bg-tan/20 text-brown"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
