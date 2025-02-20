
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLOBs } from "@/hooks/lob/useLOBs";
import { Card } from "@/components/ui/card";

interface ScenarioLOBSelectionProps {
  formData: {
    lobIds: number[];
  };
  onChange: (lobIds: number[]) => void;
}

export function ScenarioLOBSelection({ formData, onChange }: ScenarioLOBSelectionProps) {
  const { data: lobs = [], isLoading } = useLOBs();

  const handleToggleLOB = (lobId: number) => {
    const newLobIds = formData.lobIds.includes(lobId)
      ? formData.lobIds.filter((id) => id !== lobId)
      : [...formData.lobIds, lobId];
    onChange(newLobIds);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">Loading lines of business...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Select Lines of Business</Label>
        <p className="text-sm text-muted-foreground">
          Choose which lines of business will be included in this scenario.
        </p>
      </div>

      <div className="space-y-4">
        {lobs.length === 0 ? (
          <Card className="p-4">
            <p className="text-muted-foreground text-center">
              No lines of business found. Please add some first.
            </p>
          </Card>
        ) : (
          lobs.map((lob) => (
            <div key={lob.id} className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`lob-${lob.id}`}
                  checked={formData.lobIds.includes(lob.id)}
                  onCheckedChange={() => handleToggleLOB(lob.id)}
                />
                <Label htmlFor={`lob-${lob.id}`} className="cursor-pointer">
                  {lob.name}
                </Label>
              </div>
              <div className="flex items-center space-x-4 ml-auto text-sm text-muted-foreground">
                <span>{lob.type}</span>
                <span>{lob.headcount} employees</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
