import { ClientRedirect } from "./client-redirect";
import { auth } from "@clerk/nextjs/server";

export default async function RedirectPage() {
  const { sessionClaims, userId } = await auth();

  if (!userId) {
    return <ClientRedirect url="/sign-in" />;
  }

  if (sessionClaims?.metadata?.role === "admin") {
    return <ClientRedirect url="/dashboard" />;
  }

  return <ClientRedirect url="/my-payments" />;
}
