
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScenarios } from "@/hooks/scenarios/useScenarios";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";

const Scenarios = () => {
  const { data: scenarios = [], isLoading } = useScenarios();

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-workspace-primary">
          Scenarios
        </h1>
        <Button 
          className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] gap-2"
          onClick={() => {
            // TODO: Implement create scenario
            console.log("Create scenario clicked");
          }}
        >
          <Plus className="h-4 w-4" />
          New Scenario
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Loading scenarios...</p>
        </div>
      ) : scenarios.length === 0 ? (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>No Scenarios Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create your first scenario to start modeling different workspace configurations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onClick={() => {
                // TODO: Implement view details
                console.log("View scenario details:", scenario.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Scenarios;
