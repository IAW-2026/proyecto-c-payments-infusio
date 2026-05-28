import Link from "next/link";

type HeroActionsProps = {
  className?: string;
};

function HeroActions({ className }: HeroActionsProps) {
  return (
    <div className={className}>
      <Link
        href="/sign-in"
        className="px-8 py-4 bg-terracotta text-cream rounded-full text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-terracotta/20"
      >
        Comenzar ahora
      </Link>
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
