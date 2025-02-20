
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background-neutral">
        <Sidebar className="border-r border-secondary/10 bg-background">
          <SidebarHeader className="flex items-center h-16 px-6 border-b border-secondary/10">
            <img
              src="/lovable-uploads/702e52c9-f2d6-4235-82e1-b0c841a7825b.png"
              alt="Workspace Solutions"
              className="h-10 w-auto"
            />
          </SidebarHeader>
          <DashboardSidebar />
        </Sidebar>
        <main className="flex-1">
          <div className="h-16 border-b border-secondary/10 bg-background px-6 flex items-center justify-between">
            <SidebarTrigger className="h-9 w-9 border border-secondary/10 rounded-md text-secondary hover:text-primary hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary text-secondary flex items-center justify-center font-semibold">
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
