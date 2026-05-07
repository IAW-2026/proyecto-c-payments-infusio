import { Show, SignInButton, UserButton } from "@clerk/nextjs";

// Next.js requires default export for layouts
// eslint-disable-next-line import/no-default-export
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-tan/50">
        <a href="/" className="font-brand text-2xl text-brown tracking-wide">
          Infusio <span className="text-olive font-semibold">Payments</span>
        </a>
        <nav className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton>
              <button className="px-4 py-2 text-sm font-medium text-brown border border-brown/20 rounded-full hover:bg-brown/5 transition-colors cursor-pointer">
                Sign In
              </button>
            </SignInButton>
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


