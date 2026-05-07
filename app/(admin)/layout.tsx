import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Next.js requires default export for layouts
// eslint-disable-next-line import/no-default-export
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Second layer of defense: verify admin role server-side
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-brown text-cream flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-cream/10">
          <Link
            href="/"
            className="font-brand text-xl tracking-wide text-cream"
          >
            Infusio{" "}
            <span className="text-tan font-semibold">Payments</span>
          </Link>
          <p className="text-xs text-cream/50 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-cream/10 transition-colors"
          >
            <svg
              className="w-5 h-5 text-tan"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
              />
            </svg>
            Overview
          </Link>
          <Link
            href="/dashboard/payments"
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-cream/10 transition-colors"
          >
            <svg
              className="w-5 h-5 text-tan"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Payments
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-end px-6 py-4 border-b border-tan/30 bg-cream">
          <UserButton />
        </header>
        <main className="flex-1 p-6 bg-surface">{children}</main>
      </div>
    </div>
  );
}


