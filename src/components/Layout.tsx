
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/5">
        <Sidebar className="border-r border-secondary/10 bg-white">
          <SidebarHeader className="flex items-center gap-2 px-6 py-6 border-b border-secondary/10">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-10 w-auto"
            />
          </SidebarHeader>
          <DashboardSidebar />
        </Sidebar>
        <main className="flex-1">
          <div className="h-16 border-b border-secondary/10 bg-white px-6 flex items-center justify-between">
            <SidebarTrigger className="h-9 w-9 border border-secondary/10 rounded-lg text-secondary hover:text-primary hover:border-primary transition-colors" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center font-medium">
                A
              </div>
            </div>
          </div>
          <div className="container mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
