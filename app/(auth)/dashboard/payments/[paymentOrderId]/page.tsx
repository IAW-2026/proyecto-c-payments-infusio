import { Suspense } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { BackButton } from "@/components/ui/back-button";
import { PaymentDetailContent, DetailSkeleton } from "./detail-content";

type PaymentDetailPageProps = {
  params: Promise<{ paymentOrderId: string }>;
};

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const { paymentOrderId } = await params;
  const { userId } = await auth();
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[] | undefined) ?? [];
  const isAdmin = roles.includes("admin");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb - Rendered instantly */}
      <BackButton label="Volver al dashboard" />

      {/* Header title - Rendered instantly using the ID from route params */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-[#8e4722] italic mb-1 uppercase">
            Orden de Pago
          </p>
          <h1 className="font-serif text-4xl text-brown">
            #{paymentOrderId}
          </h1>
        </div>
      </div>

      {/* Dynamic database details loaded inside Suspense */}
      <Suspense fallback={<DetailSkeleton />}>
        <PaymentDetailContent
          paymentOrderId={paymentOrderId}
          userId={userId ?? null}
          isAdmin={isAdmin}
        />
      </Suspense>
    </div>
  );
}

