
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
  { 
    label: "Active Scenarios", 
    value: "2",
    trend: "up",
    change: "+1 this month"
  },
  { 
    label: "Total Spaces", 
    value: "4",
    trend: "stable",
    change: "No change"
  },
  { 
    label: "Business Units", 
    value: "3",
    trend: "up",
    change: "+1 this week"
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-[2em] font-bold text-secondary tracking-tight">
            Welcome, Andrew
          </h1>
          <p className="text-base text-secondary/80 leading-relaxed max-w-[600px]">
            Here's what's happening in your workspace. Review your spaces and scenarios to optimize your workplace strategy.
          </p>
        </div>
        
        {/* Quick Stats Cards - Refined Design */}
        <div className="flex gap-3">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-secondary px-4 py-2.5 rounded-lg w-[140px]
                group transition-all duration-200 
                hover:bg-secondary/90 hover:translate-y-[-1px] hover:shadow-sm"
            >
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-2xl font-bold text-background">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-background/70">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-background/90">
                {stat.label}
              </p>
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
              group transition-all duration-200 
              hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] hover:translate-y-[-2px]
              bg-background border-secondary/10
              ${stat.incomplete ? 'border-error border-opacity-50' : ''}
            `}
          >
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 border-b border-secondary/10">
              <div className="space-y-1.5">
                <CardTitle className="text-lg font-semibold flex items-center gap-2.5 text-secondary group-hover:text-primary transition-colors duration-200">
                  <div className="p-2.5 rounded-lg bg-background-neutral group-hover:bg-primary/10 transition-colors duration-200">
                    <stat.icon className="h-5 w-5 text-secondary group-hover:text-primary transition-colors duration-200" />
                  </div>
                  {stat.title}
                  {stat.incomplete && (
                    <div className="relative">
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full animate-ping" />
                      <AlertCircle 
                        className="h-5 w-5 text-error"
                        aria-label={`Warning: ${stat.status}`}
                      />
                    </div>
                  )}
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.status}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">
                {stat.description}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="w-full border-secondary/20 text-secondary hover:bg-secondary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  onClick={() => navigate(stat.path)}
                >
                  View All
                </Button>
                <Button
                  variant="default"
                  className={`
                    w-full font-semibold
                    ${stat.incomplete 
                      ? 'bg-error hover:bg-error/90 text-white' 
                      : 'bg-primary text-secondary hover:bg-primary-hover'
                    }
                    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    transition-colors duration-200
                  `}
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
          <h2 className="text-[1.5em] font-semibold text-secondary tracking-tight">
            Recent Activity
          </h2>
          <Button 
            variant="outline" 
            className="border-secondary/20 text-secondary hover:bg-secondary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            View All
          </Button>
        </div>
        <Card className="border-secondary/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 rounded-lg bg-background-neutral group-hover:bg-primary/10 transition-colors duration-200">
                  <Users className="h-6 w-6 text-secondary group-hover:text-primary transition-colors duration-200" />
                </div>
                <div>
                  <p className="font-medium text-secondary group-hover:text-primary transition-colors duration-200">
                    New Business Unit Added
                  </p>
                  <p className="text-secondary/60 leading-relaxed">
                    Marketing department was added to Lines of Business
                  </p>
                </div>
                <p className="ml-auto text-sm font-medium text-muted-foreground">2h ago</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 rounded-lg bg-background-neutral group-hover:bg-primary/10 transition-colors duration-200">
                  <ListTodo className="h-6 w-6 text-secondary group-hover:text-primary transition-colors duration-200" />
                </div>
                <div>
                  <p className="font-medium text-secondary group-hover:text-primary transition-colors duration-200">
                    Space Updated
                  </p>
                  <p className="text-secondary/60 leading-relaxed">
                    HQ Floor 5 space details were modified
                  </p>
                </div>
                <p className="ml-auto text-sm font-medium text-muted-foreground">5h ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
