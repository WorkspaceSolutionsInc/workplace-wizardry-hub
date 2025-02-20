
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScenarioFinancialsProps {
  formData: {
    financials: Array<{
      spaceId: number;
      monthlyCost?: number;
      leaseTermMonths?: number;
      startDate?: string;
    }>;
  };
  onChange: (financials: Array<{
    spaceId: number;
    monthlyCost?: number;
    leaseTermMonths?: number;
    startDate?: string;
  }>) => void;
}

// Temporary mock data - will be replaced with real data from API
const MOCK_SPACES = [
  { id: 1, name: "HQ - 5th Floor" },
  { id: 2, name: "Innovation Center" },
  { id: 3, name: "Downtown Office" },
];

export function ScenarioFinancials({ formData, onChange }: ScenarioFinancialsProps) {
  const handleFinancialChange = (
    spaceId: number,
    field: "monthlyCost" | "leaseTermMonths" | "startDate",
    value: string
  ) => {
    const newFinancials = [...formData.financials];
    const existingIndex = newFinancials.findIndex(f => f.spaceId === spaceId);
    
    if (existingIndex >= 0) {
      newFinancials[existingIndex] = {
        ...newFinancials[existingIndex],
        [field]: field === "startDate" ? value : Number(value) || undefined
      };
    } else {
      newFinancials.push({
        spaceId,
        [field]: field === "startDate" ? value : Number(value) || undefined
      });
    }
    
    onChange(newFinancials);
  };

  const getFinancialValue = (spaceId: number, field: "monthlyCost" | "leaseTermMonths" | "startDate") => {
    const financial = formData.financials.find(f => f.spaceId === spaceId);
    return financial?.[field] || "";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Financial Details</Label>
        <p className="text-sm text-muted-foreground">
          Enter financial information for each space in the scenario.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_SPACES.map((space) => (
          <Card key={space.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{space.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`monthly-cost-${space.id}`}>Monthly Cost</Label>
                  <Input
                    id={`monthly-cost-${space.id}`}
                    type="number"
                    placeholder="Enter amount"
                    value={getFinancialValue(space.id, "monthlyCost")}
                    onChange={(e) =>
                      handleFinancialChange(space.id, "monthlyCost", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lease-term-${space.id}`}>Lease Term (months)</Label>
                  <Input
                    id={`lease-term-${space.id}`}
                    type="number"
                    placeholder="Enter months"
                    value={getFinancialValue(space.id, "leaseTermMonths")}
                    onChange={(e) =>
                      handleFinancialChange(space.id, "leaseTermMonths", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`start-date-${space.id}`}>Start Date</Label>
                  <Input
                    id={`start-date-${space.id}`}
                    type="date"
                    value={getFinancialValue(space.id, "startDate")}
                    onChange={(e) =>
                      handleFinancialChange(space.id, "startDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
