
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scenario } from "./types";

interface ScenarioCardProps {
  scenario: Scenario;
  onClick: () => void;
}

const formatObjective = (objective: string) => {
  return objective
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in_progress':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export function ScenarioCard({ scenario, onClick }: ScenarioCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-workspace-primary">
            {scenario.name}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(scenario.status)} text-white`}
          >
            {scenario.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-2">
          {scenario.description || formatObjective(scenario.objective)}
        </p>
        <p className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(scenario.created_at))} ago
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="ml-auto flex items-center gap-2 text-workspace-primary hover:text-workspace-primary/90"
          onClick={onClick}
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
