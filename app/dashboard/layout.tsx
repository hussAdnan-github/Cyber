import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
        <footer className="text-center py-4 text-xs text-gray-500 border-t border-gray-200 shrink-0">
          © AAA CYBER 2026
        </footer>
      </div>
    </div>
  );
}
