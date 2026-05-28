import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-tan/50 bg-cream">
        <Logo />
        <nav className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton fallbackRedirectUrl="/redirect" mode="modal">
              <button
                type="button"
                className="relative text-lg font-medium text-brown/60 hover:text-brown transition-colors cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brown after:transition-all after:duration-300 hover:after:w-full"
              >
                Acceder
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <ScrollToTop />
    </div>
  );
}


