import { ClerkProvider } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { UserMenu } from "@/components/ui/user-menu";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-tan/50 bg-cream">
          <Logo />
          <UserMenu />
        </header>
        <main className="flex-1 bg-cream">{children}</main>
        <ScrollToTop />
      </div>
    </ClerkProvider>
  );
}

