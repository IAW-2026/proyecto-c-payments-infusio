import { ReactNode } from "react";

interface DashboardHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode; // For the export button or other actions
}

export function DashboardHeader({
  eyebrow,
  title,
  description,
  children,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-[73px] z-40 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-background/80 backdrop-blur-md pb-4 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-8 border-b border-tan/20">
      <div>
        <p className="text-xs tracking-[0.3em] text-red-900 italic mb-2 sm:mb-4 uppercase">
          {eyebrow}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brown mb-2">
          {title}
        </h1>
        <p className="text-sm text-brown/70 italic">
          {description}
        </p>
      </div>
      {children && <div className="sm:pt-8">{children}</div>}
    </header>
  );
}
