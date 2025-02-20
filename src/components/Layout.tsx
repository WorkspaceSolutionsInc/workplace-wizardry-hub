
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-workspace-accent">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <SidebarTrigger className="mb-6" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
