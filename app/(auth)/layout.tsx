import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-tan/50 bg-cream">
        <Logo />
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton fallbackRedirectUrl="/redirect" mode="modal">
              <button
                type="button"
                className="relative text-base font-medium text-brown/60 hover:text-brown transition-colors cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brown after:transition-all after:duration-300 hover:after:w-full"
              >
                Acceder
              </button>
            </SignInButton>
          </Show>
        </div>
      </header>
      <main className="flex-1 bg-cream">{children}</main>
      <ScrollToTop />
    </div>
  );
}


