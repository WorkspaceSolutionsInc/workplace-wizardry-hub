
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScenarioBasicInfo } from "./wizard/ScenarioBasicInfo";
import { ScenarioLOBSelection } from "./wizard/ScenarioLOBSelection";
import { ScenarioSpaceSelection } from "./wizard/ScenarioSpaceSelection";
import { ScenarioAttributeRatings } from "./wizard/ScenarioAttributeRatings";
import { ScenarioFinancials } from "./wizard/ScenarioFinancials";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { ScenarioObjective } from "./types";

interface CreateScenarioFormData {
  name: string;
  objective: ScenarioObjective;
  description?: string;
  lobIds: number[];
  spaceIds: number[];
  attributeRatings: Array<{
    attributeId: number;
    lobId: number;
    rating: number;
  }>;
  financials: Array<{
    spaceId: number;
    monthlyCost?: number;
    leaseTermMonths?: number;
    startDate?: string;
  }>;
}

interface CreateScenarioWizardProps {
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Lines of Business" },
  { id: 3, title: "Spaces" },
  { id: 4, title: "Attribute Ratings" },
  { id: 5, title: "Financials" }
];

export function CreateScenarioWizard({ onClose }: CreateScenarioWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateScenarioFormData>({
    name: "",
    objective: "cost_optimization",
    description: "",
    lobIds: [],
    spaceIds: [],
    attributeRatings: [],
    financials: []
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement scenario creation logic
      toast({
        title: "Success",
        description: "Scenario created successfully"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scenario",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScenarioBasicInfo
            formData={formData}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      case 2:
        return (
          <ScenarioLOBSelection
            formData={formData}
            onChange={(lobIds) => setFormData({ ...formData, lobIds })}
          />
        );
      case 3:
        return (
          <ScenarioSpaceSelection
            formData={formData}
            onChange={(spaceIds) => setFormData({ ...formData, spaceIds })}
          />
        );
      case 4:
        return (
          <ScenarioAttributeRatings
            formData={formData}
            onChange={(attributeRatings) => setFormData({ ...formData, attributeRatings })}
          />
        );
      case 5:
        return (
          <ScenarioFinancials
            formData={formData}
            onChange={(financials) => setFormData({ ...formData, financials })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-workspace-primary">
            Create New Scenario
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  step.id !== STEPS.length ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id <= currentStep
                      ? "bg-[#fccc55] text-[#474a4f]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id}
                </div>
                {step.id !== STEPS.length && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step.id < currentStep ? "bg-[#fccc55]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            {STEPS.map((step) => (
              <div key={step.id} className="text-center">
                {step.title}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">{renderStep()}</div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep === STEPS.length ? (
            <Button
              className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45]"
              onClick={handleSubmit}
            >
              Create Scenario
            </Button>
          ) : (
            <Button
              className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45]"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
