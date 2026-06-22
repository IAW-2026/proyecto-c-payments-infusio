import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminView } from "@/components/dashboard/admin-view";
import { BuyerView } from "@/components/dashboard/buyer-view";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default async function UnifiedDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { userId } = await auth();
  const { page: pageParam, status } = await searchParams;
  const page = parseInt(pageParam || "1", 10);

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[] | undefined) ?? [];
  const isAdmin = roles.includes("admin");

  if (isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <DashboardHeader
          eyebrow="Administración Global"
          title="Panel Maestro"
          description="Resumen total de la red Infusio."
        />
        <Suspense fallback={<DashboardSkeleton showHeader={false} />}>
          <AdminView page={page} status={status} />
        </Suspense>
      </div>
    );
  }

  // Default: Buyer view
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <DashboardHeader
        eyebrow="Tu Actividad"
        title="Mis Compras"
        description="Historial detallado de tus transacciones."
      />
      <Suspense fallback={<DashboardSkeleton showHeader={false} />}>
        <BuyerView userId={userId} page={page} />
      </Suspense>
    </div>
  );
}
