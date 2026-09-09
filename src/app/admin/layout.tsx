import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-nav";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { requireAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="bg-muted/35 min-h-screen">
      <AdminSidebar />
      <div className="lg:pl-64">
        <header className="bg-background/85 sticky top-0 z-40 flex h-18 items-center justify-between border-b px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <AdminMobileNav />
            </div>
            <Breadcrumbs />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden text-xs sm:inline">
              {session.email}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
