
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LOB = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-semibold text-workspace-primary mb-8">
        Lines of Business
      </h1>
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Business Units</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your lines of business and their workspace preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LOB;
