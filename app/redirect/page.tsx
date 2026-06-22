import { ClientRedirect } from "./client-redirect";
import { auth } from "@clerk/nextjs/server";

export default async function RedirectPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return <ClientRedirect url="/sign-in" />;
  }

  // Todos van al dashboard; la diferenciación admin/buyer ocurre allí
  return <ClientRedirect url="/dashboard" />;
}
