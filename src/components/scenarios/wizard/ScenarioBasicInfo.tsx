
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScenarioObjective } from "../types";

interface ScenarioBasicInfoProps {
  formData: {
    name: string;
    objective: ScenarioObjective;
    description?: string;
  };
  onChange: (data: {
    name: string;
    objective: ScenarioObjective;
    description?: string;
  }) => void;
}

const OBJECTIVES: { value: ScenarioObjective; label: string }[] = [
  { value: "cost_optimization", label: "Cost Optimization" },
  { value: "workforce_retention", label: "Workforce Retention" },
  { value: "brand_enhancement", label: "Brand Enhancement" },
  { value: "innovation_and_creativity", label: "Innovation and Creativity" },
  { value: "environmental_sustainability", label: "Environmental Sustainability" },
  { value: "employee_wellbeing", label: "Employee Wellbeing" },
  { value: "operational_efficiency", label: "Operational Efficiency" },
  { value: "market_expansion", label: "Market Expansion" },
  { value: "talent_attraction", label: "Talent Attraction" },
  { value: "digital_transformation", label: "Digital Transformation" },
];

export function ScenarioBasicInfo({ formData, onChange }: ScenarioBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Scenario Name</Label>
        <Input
          id="name"
          placeholder="Enter scenario name"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective">Primary Objective</Label>
        <Select
          value={formData.objective}
          onValueChange={(value: ScenarioObjective) =>
            onChange({ ...formData, objective: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an objective" />
          </SelectTrigger>
          <SelectContent>
            {OBJECTIVES.map((objective) => (
              <SelectItem key={objective.value} value={objective.value}>
                {objective.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter scenario description"
          value={formData.description || ""}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
