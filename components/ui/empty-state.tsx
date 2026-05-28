import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * Generic empty state card used when a list or dashboard has no data to show.
 * Renders a centered card with an icon, title, description, and optional CTA.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="bg-card rounded-3xl border border-tan/30 shadow-sm p-12 sm:p-16 max-w-lg w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-tan/20 flex items-center justify-center">
          <Icon size={36} className="text-brown/30" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-brown">{title}</h2>
          <p className="text-sm text-brown/75 leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>
        {actionLabel && actionHref && (
          <a
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-olive text-cream text-sm font-medium hover:bg-olive/90 transition-colors shadow-sm"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}
