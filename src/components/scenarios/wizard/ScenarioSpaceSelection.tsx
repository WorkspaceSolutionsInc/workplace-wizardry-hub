
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface ScenarioSpaceSelectionProps {
  formData: {
    spaceIds: number[];
  };
  onChange: (spaceIds: number[]) => void;
}

// Temporary mock data - will be replaced with real data from API
const MOCK_SPACES = [
  { id: 1, name: "HQ - 5th Floor", sqft: 20000, location: "New York" },
  { id: 2, name: "Innovation Center", sqft: 15000, location: "San Francisco" },
  { id: 3, name: "Downtown Office", sqft: 10000, location: "Chicago" },
];

export function ScenarioSpaceSelection({ formData, onChange }: ScenarioSpaceSelectionProps) {
  const handleToggleSpace = (spaceId: number) => {
    const newSpaceIds = formData.spaceIds.includes(spaceId)
      ? formData.spaceIds.filter((id) => id !== spaceId)
      : [...formData.spaceIds, spaceId];
    onChange(newSpaceIds);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Select Spaces</Label>
        <p className="text-sm text-muted-foreground">
          Choose which spaces will be included in this scenario.
        </p>
      </div>

      <div className="grid gap-4">
        {MOCK_SPACES.map((space) => (
          <Card key={space.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Checkbox
                  id={`space-${space.id}`}
                  checked={formData.spaceIds.includes(space.id)}
                  onCheckedChange={() => handleToggleSpace(space.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={`space-${space.id}`} className="cursor-pointer">
                    <div className="font-medium">{space.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {space.sqft.toLocaleString()} sq ft • {space.location}
                    </div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
