import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminView } from "@/components/dashboard/admin-view";
import { BuyerView } from "@/components/dashboard/buyer-view";

export default async function UnifiedDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { userId, sessionClaims } = await auth();
  const { page: pageParam, status } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  
  if (!userId) {
    redirect("/sign-in");
  }

  const role = sessionClaims?.metadata?.role as string | undefined;

  if (role === "admin") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AdminView page={page} status={status} />
      </div>
    );
  }

  // Default: Buyer view
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <BuyerView userId={userId} page={page} />
    </div>
  );
}
