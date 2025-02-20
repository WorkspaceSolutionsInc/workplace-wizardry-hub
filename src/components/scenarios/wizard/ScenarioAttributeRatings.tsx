
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScenarioAttributeRatingsProps {
  formData: {
    attributeRatings: Array<{
      attributeId: number;
      lobId: number;
      rating: number;
    }>;
  };
  onChange: (attributeRatings: Array<{
    attributeId: number;
    lobId: number;
    rating: number;
  }>) => void;
}

// Temporary mock data - will be replaced with real data from API
const MOCK_ATTRIBUTES = [
  { id: 1, name: "Location Convenience", description: "Accessibility and commute time" },
  { id: 2, name: "Workspace Quality", description: "Overall quality and condition" },
  { id: 3, name: "Amenities", description: "Available facilities and services" },
];

export function ScenarioAttributeRatings({ formData, onChange }: ScenarioAttributeRatingsProps) {
  const handleRatingChange = (attributeId: number, rating: number) => {
    const newRatings = [...formData.attributeRatings];
    const existingIndex = newRatings.findIndex(r => r.attributeId === attributeId);
    
    if (existingIndex >= 0) {
      newRatings[existingIndex] = { ...newRatings[existingIndex], rating };
    } else {
      newRatings.push({ attributeId, lobId: 1, rating }); // Using default lobId for now
    }
    
    onChange(newRatings);
  };

  const getRating = (attributeId: number) => {
    return formData.attributeRatings.find(r => r.attributeId === attributeId)?.rating || 0;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Rate Attributes</Label>
        <p className="text-sm text-muted-foreground">
          Rate how well each attribute matches your requirements.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_ATTRIBUTES.map((attribute) => (
          <Card key={attribute.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{attribute.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {attribute.description}
              </p>
              <div className="flex items-center gap-4">
                <Slider
                  value={[getRating(attribute.id)]}
                  onValueChange={([value]) => handleRatingChange(attribute.id, value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-sm font-medium">
                  {getRating(attribute.id)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
