import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { UserActions } from "./user-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="bg-[#f7f1ea] min-h-screen pb-16 pt-28">
      <div className="container-page max-w-4xl">
        <Link href="/admin/settings" className="inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to settings
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-semibold text-charcoal">Team Members</h1>
        </div>

        {/* Create new account */}
        <section className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(34,34,34,0.05)] sm:p-8">
          <h2 className="text-xl font-semibold text-charcoal">Add New Account</h2>
          <p className="mt-1 text-sm text-ink/55">Create a staff login. Set role to Admin to give full dashboard access.</p>
          <UserActions mode="create" />
        </section>

        {/* Existing users */}
        <section className="mt-6 overflow-hidden rounded-[28px] bg-white shadow-[0_14px_45px_rgba(34,34,34,0.05)]">
          <div className="border-b border-maroon/10 p-6">
            <h2 className="text-xl font-semibold text-charcoal">All Accounts ({users.length})</h2>
          </div>
          <div className="divide-y divide-maroon/5">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div>
                  <p className="font-semibold text-charcoal">{user.name || "(No name)"}</p>
                  <p className="text-sm text-ink/55">{user.email}</p>
                  <span className={`mt-1 inline-flex rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                    user.role === "ADMIN" ? "bg-maroon/10 text-maroon" : "bg-cream text-ink/50"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <UserActions mode="manage" userId={user.id} currentName={user.name ?? ""} currentRole={user.role} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
