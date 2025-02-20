
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Building2,
  Users,
  ListTodo,
  TrendingUp,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Company Profile",
    description: "Configure your workspace attributes",
    icon: Building2,
    path: "/company",
    status: "Industry: Technology",
    action: "Edit Profile",
    incomplete: false,
  },
  {
    title: "Lines of Business",
    description: "Manage your business units",
    icon: Users,
    path: "/lob",
    status: "3 Business Units",
    action: "Add New",
    incomplete: false,
  },
  {
    title: "Spaces",
    description: "Track your office properties",
    icon: ListTodo,
    path: "/spaces",
    status: "4 Spaces, 2 Incomplete",
    action: "Add Space",
    incomplete: true,
  },
  {
    title: "Scenarios",
    description: "Plan and analyze effectiveness",
    icon: TrendingUp,
    path: "/scenarios",
    status: "2 Active Scenarios",
    action: "Create New",
    incomplete: true,
  },
  {
    title: "Analytics Dashboard",
    description: "View detailed workspace analytics",
    icon: BarChart3,
    path: "/analytics",
    status: "Premium Feature",
    action: "Upgrade",
    incomplete: false,
  },
  {
    title: "Resource Center",
    description: "Access guides and documentation",
    icon: LayoutGrid,
    path: "/resources",
    status: "12 Resources Available",
    action: "View All",
    incomplete: false,
  }
];

const quickStats = [
  { label: "Active Scenarios", value: "2" },
  { label: "Total Spaces", value: "4" },
  { label: "Business Units", value: "3" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-secondary">
            Welcome, Andrew
          </h1>
          <p className="text-secondary/60 mt-1">
            Here's what's happening in your workspace
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4 flex-wrap">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-secondary px-4 py-2 rounded-lg"
            >
              <p className="text-2xl font-semibold text-white">
                {stat.value}
              </p>
              <p className="text-xs text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`
              group cursor-pointer transition-all duration-200 
              hover:shadow-lg hover:border-primary
              border-secondary/10 bg-white
              ${stat.incomplete ? 'border-orange-300' : ''}
            `}
          >
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-secondary group-hover:text-primary">
                  <div className="p-2 rounded-lg bg-secondary/5 group-hover:bg-primary/10">
                    <stat.icon className="h-5 w-5 text-secondary group-hover:text-primary" />
                  </div>
                  {stat.title}
                  {stat.incomplete && (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  )}
                </CardTitle>
                <p className="text-sm font-medium text-secondary/60">
                  {stat.status}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-secondary/80">
                {stat.description}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="w-full border-secondary/20 text-secondary hover:bg-secondary/5"
                  onClick={() => navigate(stat.path)}
                >
                  View All
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90 text-secondary font-medium"
                  onClick={() => navigate(stat.path)}
                >
                  {stat.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-secondary">
            Recent Activity
          </h2>
          <Button 
            variant="outline" 
            className="border-secondary/20 text-secondary hover:bg-secondary/5"
          >
            View All
          </Button>
        </div>
        <Card className="border-secondary/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-secondary/5">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-secondary">New Business Unit Added</p>
                  <p className="text-sm text-secondary/60">
                    Marketing department was added to Lines of Business
                  </p>
                </div>
                <p className="ml-auto text-sm text-secondary/60">2h ago</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-secondary/5">
                  <ListTodo className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-secondary">Space Updated</p>
                  <p className="text-sm text-secondary/60">
                    HQ Floor 5 space details were modified
                  </p>
                </div>
                <p className="ml-auto text-sm text-secondary/60">5h ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
