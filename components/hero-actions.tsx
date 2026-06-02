import Link from "next/link";

type HeroActionsProps = {
  className?: string;
};

function HeroActions({ className }: HeroActionsProps) {
  return (
    <div className={className}>
      <Link
        href="/sign-in"
        className="px-8 py-4 bg-olive text-cream rounded-full text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-olive/20"
      >
        Comenzar ahora
      </Link>
      <a
        href="#features"
        className="px-8 py-4 border border-cream/50 text-cream rounded-full text-sm font-semibold hover:bg-cream/10 transition-all backdrop-blur-sm"
      >
        Conocer más
      </a>
    </div>
  );
}


export { HeroActions };
