
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-semibold text-workspace-primary mb-8">
        Settings
      </h1>
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure your application preferences and settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
