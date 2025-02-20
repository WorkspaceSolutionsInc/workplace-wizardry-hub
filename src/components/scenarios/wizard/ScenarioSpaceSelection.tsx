
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useSpaces } from "@/hooks/spaces/useSpaces";

interface ScenarioSpaceSelectionProps {
  formData: {
    spaceIds: number[];
  };
  onChange: (spaceIds: number[]) => void;
}

export function ScenarioSpaceSelection({ formData, onChange }: ScenarioSpaceSelectionProps) {
  const { data: spaces = [], isLoading } = useSpaces();

  const handleToggleSpace = (spaceId: number) => {
    const newSpaceIds = formData.spaceIds.includes(spaceId)
      ? formData.spaceIds.filter((id) => id !== spaceId)
      : [...formData.spaceIds, spaceId];
    onChange(newSpaceIds);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Loading spaces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Select Spaces</Label>
        <p className="text-sm text-muted-foreground">
          Choose which spaces will be included in this scenario.
        </p>
      </div>

      <div className="grid gap-4">
        {spaces.length === 0 ? (
          <Card className="p-4">
            <p className="text-muted-foreground text-center">
              No spaces found. Please add some first.
            </p>
          </Card>
        ) : (
          spaces.map((space) => (
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
                        {space.square_feet.toLocaleString()} sq ft • {space.location}
                      </div>
                    </Label>
                  </div>
                  {space.monthly_cost && (
                    <div className="text-sm text-muted-foreground">
                      ${space.monthly_cost.toLocaleString()}/month
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
