import { Show, UserButton, SignInButton } from "@clerk/nextjs";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-tan/50 bg-cream">
        <a href="/" className="font-brand text-2xl text-brown tracking-wide">
          Infusio <span className="text-olive font-semibold">Payments</span>
        </a>
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <div className="px-4 py-2 text-sm font-medium text-cream bg-olive rounded-full hover:bg-olive/90 transition-colors cursor-pointer inline-block">
              <SignInButton fallbackRedirectUrl="/redirect" mode="modal" />
            </div>
          </Show>
        </div>
      </header>
      <main className="flex-1 bg-cream">{children}</main>
    </div>
  );
}


