
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ScenarioLOBSelectionProps {
  formData: {
    lobIds: number[];
  };
  onChange: (lobIds: number[]) => void;
}

// Temporary mock data - will be replaced with real data from API
const MOCK_LOBS = [
  { id: 1, name: "Research & Development" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Sales" },
  { id: 4, name: "Operations" },
];

export function ScenarioLOBSelection({ formData, onChange }: ScenarioLOBSelectionProps) {
  const handleToggleLOB = (lobId: number) => {
    const newLobIds = formData.lobIds.includes(lobId)
      ? formData.lobIds.filter((id) => id !== lobId)
      : [...formData.lobIds, lobId];
    onChange(newLobIds);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Select Lines of Business</Label>
        <p className="text-sm text-muted-foreground">
          Choose which lines of business will be included in this scenario.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_LOBS.map((lob) => (
          <div key={lob.id} className="flex items-center space-x-2">
            <Checkbox
              id={`lob-${lob.id}`}
              checked={formData.lobIds.includes(lob.id)}
              onCheckedChange={() => handleToggleLOB(lob.id)}
            />
            <Label htmlFor={`lob-${lob.id}`} className="cursor-pointer">
              {lob.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
