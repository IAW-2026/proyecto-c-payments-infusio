"use client";

import { Logo } from "@/components/ui/logo";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream animate-in fade-in duration-500">
      <div className="relative flex flex-col items-center">
        {/* Logo with breathing animation */}
        <div className="animate-pulse duration-[2000ms]">
          <Logo showText={false} className="scale-[2.5]" />
        </div>
        
        {/* Steaming effect (simple CSS) */}
        <div className="absolute -top-8 flex gap-1">
          <div className="w-1 h-4 bg-brown/10 rounded-full animate-steam-1" />
          <div className="w-1 h-6 bg-brown/10 rounded-full animate-steam-2 delay-75" />
          <div className="w-1 h-4 bg-brown/10 rounded-full animate-steam-3 delay-150" />
        </div>

        <p className="mt-12 text-xs tracking-[0.3em] text-brown/40 uppercase font-medium animate-pulse">
          Preparando tu Infusio...
        </p>
      </div>

      <style jsx global>{`
        @keyframes steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-20px) scaleX(2); opacity: 0; }
        }
        .animate-steam-1 { animation: steam 2s infinite ease-out; }
        .animate-steam-2 { animation: steam 2.5s infinite ease-out; }
        .animate-steam-3 { animation: steam 2.2s infinite ease-out; }
      `}</style>
    </div>
  );
}
