
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { Scenario } from "./types";

interface ScenarioCardProps {
  scenario: Scenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const navigate = useNavigate();

  const objectiveLabels: Record<Scenario['objective'], string> = {
    cost_optimization: "Cost Optimization",
    workforce_retention: "Workforce Retention",
    brand_enhancement: "Brand Enhancement",
    innovation_and_creativity: "Innovation and Creativity",
    environmental_sustainability: "Environmental Sustainability",
    employee_wellbeing: "Employee Wellbeing",
    operational_efficiency: "Operational Efficiency",
    market_expansion: "Market Expansion",
    talent_attraction: "Talent Attraction",
    digital_transformation: "Digital Transformation"
  };

  const statusColors: Record<Scenario['status'], string> = {
    draft: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  const statusLabels: Record<Scenario['status'], string> = {
    draft: "Draft",
    in_progress: "In Progress",
    completed: "Completed"
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer bg-white/50 backdrop-blur-sm"
      onClick={() => navigate(`/scenarios/${scenario.id}`)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <h3 className="font-medium leading-none">{scenario.name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[scenario.status]}`}>
          {statusLabels[scenario.status]}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {objectiveLabels[scenario.objective]}
        </p>
        {scenario.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {scenario.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
