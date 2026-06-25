import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin, getCurrentSession } from "@/lib/authz";
import { ChangePasswordForm } from "./change-password-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/login");

  const me = await getCurrentSession();

  return (
    <div className="bg-[#f7f1ea] min-h-screen pb-16 pt-28">
      <div className="container-page max-w-2xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="mt-4 text-4xl font-semibold text-charcoal">Settings</h1>

        <section className="mt-8 rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(34,34,34,0.05)] sm:p-8">
          <h2 className="text-2xl font-semibold text-charcoal">Change Password</h2>
          <p className="mt-1 text-sm text-ink/55">Update the password for <strong>{me?.user.email}</strong></p>
          <ChangePasswordForm />
        </section>

        <div className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_14px_45px_rgba(34,34,34,0.05)] sm:p-8">
          <h2 className="text-2xl font-semibold text-charcoal">Team Accounts</h2>
          <p className="mt-1 text-sm text-ink/55">Manage staff who can access and process orders.</p>
          <Link href="/admin/users" className="btn-primary mt-6 inline-flex">
            Manage Team Members
          </Link>
        </div>
      </div>
    </div>
  );
}
