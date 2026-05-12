import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-tan/50">
        <Logo />
        <nav className="flex items-center gap-4">
          <Show when="signed-out">
            <div className="px-4 py-2 text-sm font-medium text-brown border border-brown/20 rounded-full hover:bg-brown/5 transition-colors cursor-pointer inline-block">
              <SignInButton fallbackRedirectUrl="/redirect" mode="modal" />
            </div>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}


