
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Spaces = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-semibold text-workspace-primary mb-8">
        Spaces
      </h1>
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Office Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Track and manage your office spaces and properties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Spaces;
