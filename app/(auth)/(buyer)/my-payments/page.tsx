import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { BuyerView } from "@/components/dashboard/buyer-view";

export default async function MyPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth();
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1", 10);
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <BuyerView userId={userId} page={page} />
    </div>
  );
}
