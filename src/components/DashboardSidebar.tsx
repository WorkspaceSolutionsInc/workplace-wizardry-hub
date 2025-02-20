
import {
  BarChart3,
  Building2,
  Layout,
  ListTodo,
  Settings,
  Users,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: Layout, path: "/" },
  { title: "Company Profile", icon: Building2, path: "/company" },
  { title: "Lines of Business", icon: Users, path: "/lob" },
  { title: "Spaces", icon: ListTodo, path: "/spaces" },
  { title: "Scenarios", icon: BarChart3, path: "/scenarios" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function DashboardSidebar() {
  const navigate = useNavigate();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="px-6 text-xs font-medium text-[#474a4f]/60 mt-4">
          Navigation
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={() => navigate(item.path)}
                  className="px-6 py-3 w-full flex items-center gap-3 text-[#474a4f]/80 hover:text-[#474a4f] hover:bg-[#fccc55]/5 rounded-none transition-colors relative group"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#fccc55] scale-y-0 group-hover:scale-y-100 transition-transform" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
