
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f8f8f8]">
        <Sidebar className="border-r border-[#474a4f]/10 bg-white">
          <SidebarHeader className="flex items-center h-16 px-6 border-b border-[#474a4f]/10">
            <img
              src="/lovable-uploads/702e52c9-f2d6-4235-82e1-b0c841a7825b.png"
              alt="Workspace Solutions"
              className="h-10 w-auto"
            />
          </SidebarHeader>
          <DashboardSidebar />
        </Sidebar>
        <main className="flex-1">
          <div className="h-16 border-b border-[#474a4f]/10 bg-white px-6 flex items-center justify-between">
            <SidebarTrigger className="h-9 w-9 border border-[#474a4f]/10 rounded-lg text-[#474a4f] hover:text-[#fccc55] hover:border-[#fccc55] transition-colors" />
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-[#fccc55] text-[#474a4f] flex items-center justify-center font-medium">
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
