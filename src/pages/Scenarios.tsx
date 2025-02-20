
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Scenarios = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-semibold text-workspace-primary mb-8">
        Scenarios
      </h1>
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Workplace Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create and analyze workplace effectiveness scenarios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scenarios;
