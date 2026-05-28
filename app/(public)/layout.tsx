import Link from "next/link";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-tan/50 bg-cream">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          aria-label="Infusio Payments"
        >
          <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-300" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/favicon.ico"
              alt=""
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-serif text-2xl text-brown tracking-wide" aria-hidden="true">
            Infusio <span className="text-olive font-semibold italic">Payments</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="relative text-lg font-medium text-brown/85 hover:text-brown transition-colors cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brown after:transition-all after:duration-300 hover:after:w-full"
          >
            Acceder
          </Link>
        </nav>
      </header>

      <main className="flex-1">{children}</main>
      <ScrollToTop />
    </div>
  );
}
