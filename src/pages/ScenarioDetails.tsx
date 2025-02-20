
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Scenario } from "@/components/scenarios/types";

async function fetchScenarioDetails(id: number) {
  const { data, error } = await supabase
    .from("scenarios")
    .select(`
      *,
      scenario_lobs(
        lob_id
      ),
      scenario_spaces(
        space_id
      ),
      scenario_attribute_ratings(
        attribute_id,
        lob_id,
        rating
      ),
      scenario_financials(
        space_id,
        monthly_cost,
        lease_term_months,
        start_date
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

const ScenarioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: scenario, isLoading, error } = useQuery({
    queryKey: ["scenario", id],
    queryFn: () => fetchScenarioDetails(Number(id)),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="animate-fadeIn flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Loading scenario details...</p>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="animate-fadeIn space-y-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/scenarios")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scenarios
        </Button>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Failed to load scenario details. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const statusLabels: Record<Scenario['status'], string> = {
    draft: "Draft",
    in_progress: "In Progress",
    completed: "Completed"
  };

  const statusColors: Record<Scenario['status'], string> = {
    draft: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/scenarios")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scenarios
        </Button>
        <div className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[scenario.status]}`}>
          {statusLabels[scenario.status]}
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-workspace-primary">
          {scenario.name}
        </h1>
        {scenario.description && (
          <p className="text-muted-foreground max-w-2xl">
            {scenario.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Objective</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{objectiveLabels[scenario.objective]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lines of Business</CardTitle>
          </CardHeader>
          <CardContent>
            {scenario.scenario_lobs?.length ? (
              <p>{scenario.scenario_lobs.length} LOBs selected</p>
            ) : (
              <p className="text-muted-foreground">No LOBs selected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spaces</CardTitle>
          </CardHeader>
          <CardContent>
            {scenario.scenario_spaces?.length ? (
              <p>{scenario.scenario_spaces.length} spaces included</p>
            ) : (
              <p className="text-muted-foreground">No spaces selected</p>
            )}
          </CardContent>
        </Card>

        {scenario.scenario_attribute_ratings?.length > 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-lg">Attribute Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{scenario.scenario_attribute_ratings.length} ratings provided</p>
            </CardContent>
          </Card>
        )}

        {scenario.scenario_financials?.length > 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-lg">Financial Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{scenario.scenario_financials.length} financial records</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ScenarioDetails;
