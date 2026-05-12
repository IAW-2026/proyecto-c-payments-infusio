import { ClientRedirect } from "./client-redirect";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function RedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    return <ClientRedirect url="/sign-in" />;
  }

  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  if (role === "admin" || role === "seller") {
    return <ClientRedirect url="/dashboard" />;
  }

  return <ClientRedirect url="/my-payments" />;
}
