
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Building2,
  Users,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Company Profile",
    description: "Configure your workspace attributes",
    icon: Building2,
    path: "/company",
  },
  {
    title: "Lines of Business",
    description: "Manage your business units",
    icon: Users,
    path: "/lob",
  },
  {
    title: "Spaces",
    description: "Track your office properties",
    icon: ListTodo,
    path: "/spaces",
  },
  {
    title: "Scenarios",
    description: "Plan and analyze effectiveness",
    icon: TrendingUp,
    path: "/scenarios",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-workspace-primary mb-2">
          Welcome to Workplace Hub
        </h1>
        <p className="text-muted-foreground">
          Optimize your workplace effectiveness with data-driven insights
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white/50 backdrop-blur-sm"
            onClick={() => navigate(stat.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-workspace-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-workspace-primary mb-4">
          Recent Activity
        </h2>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Your recent activity will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
