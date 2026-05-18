import { ClientRedirect } from "./client-redirect";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function RedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    return <ClientRedirect url="/sign-in" />;
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  if (role === "seller") {
    // TODO: Ajustar a la ruta real si el seller tiene su propio panel
    return <ClientRedirect url="/seller" />;
  }

  // Admins y Buyers comparten la misma ruta base
  return <ClientRedirect url="/dashboard" />;
}
