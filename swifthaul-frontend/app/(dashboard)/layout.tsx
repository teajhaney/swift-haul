import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AuthGuard } from "@/components/layout/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-surface-elevated">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />

          {/* Scrollable content — extra bottom padding on mobile for bottom nav */}
          <main className="flex-1 overflow-y-auto p-6 pb-24 lg:pb-6">
            {children}
          </main>
        </div>

        {/* Mobile bottom tab bar */}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
