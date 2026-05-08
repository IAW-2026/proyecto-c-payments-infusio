import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function RedirectPage() {
  const { sessionClaims, userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Si tiene rol admin en Clerk, va al dashboard de admin
  if (sessionClaims?.metadata?.role === "admin") {
    redirect("/dashboard");
  }

  // Sino, es usuario normal (buyer/seller) y va a su panel de pagos
  redirect("/my-payments");
}
