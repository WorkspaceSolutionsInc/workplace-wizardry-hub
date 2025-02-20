
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Company = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-semibold text-workspace-primary mb-8">
        Company Profile
      </h1>
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure your company profile and workspace attributes here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Company;
