import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await getCurrentSession();
  return session?.user.role === "ADMIN" ? session : null;
}
