
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/5">
        <Sidebar className="border-r border-secondary/10">
          <SidebarHeader className="flex items-center gap-2 px-4 py-2">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-8 w-auto"
            />
          </SidebarHeader>
          <DashboardSidebar />
        </Sidebar>
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <SidebarTrigger className="mb-6 text-secondary hover:text-primary" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
