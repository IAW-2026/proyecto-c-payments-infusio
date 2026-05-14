"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const href = mounted && isSignedIn ? "/dashboard" : "/";

  return (
    <Link href={href} className={`flex items-center gap-3 group ${className}`}>
      <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-300">
        <Image
          src="/favicon.ico"
          alt="Infusio Logo"
          fill
          className="object-contain"
        />
      </div>
      {showText && (
        <span className="font-brand text-2xl text-brown tracking-wide">
          Infusio <span className="text-olive font-semibold italic">Payments</span>
        </span>
      )}
    </Link>
  );
}
