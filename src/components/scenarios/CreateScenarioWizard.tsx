
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScenarioBasicInfo } from "./wizard/ScenarioBasicInfo";
import { ScenarioLOBSelection } from "./wizard/ScenarioLOBSelection";
import { ScenarioSpaceSelection } from "./wizard/ScenarioSpaceSelection";
import { ScenarioAttributeRatings } from "./wizard/ScenarioAttributeRatings";
import { ScenarioFinancials } from "./wizard/ScenarioFinancials";
import { WizardSteps } from "./wizard/WizardSteps";
import type { CreateScenarioFormData, WizardStep } from "./wizard/types";

interface CreateScenarioWizardProps {
  onClose: () => void;
}

const STEPS: WizardStep[] = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Lines of Business" },
  { id: 3, title: "Spaces" },
  { id: 4, title: "Attribute Ratings" },
  { id: 5, title: "Financials" }
];

export function CreateScenarioWizard({ onClose }: CreateScenarioWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const queryClient = useQueryClient();

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name) {
          toast({
            title: "Error",
            description: "Please enter a scenario name",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (formData.lobIds.length === 0) {
          toast({
            title: "Error",
            description: "Please select at least one line of business",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (formData.spaceIds.length === 0) {
          toast({
            title: "Error",
            description: "Please select at least one space",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
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
      setIsSubmitting(true);

      const { data: scenario, error: scenarioError } = await supabase
        .from("scenarios")
        .insert({
          name: formData.name,
          objective: formData.objective,
          description: formData.description,
          status: "draft"
        })
        .select()
        .single();

      if (scenarioError) throw scenarioError;

      // Insert LOBs
      if (formData.lobIds.length > 0) {
        const { error: lobError } = await supabase
          .from("scenario_lobs")
          .insert(
            formData.lobIds.map(lobId => ({
              scenario_id: scenario.id,
              lob_id: lobId
            }))
          );

        if (lobError) throw lobError;
      }

      // Insert Spaces and Financials
      if (formData.spaceIds.length > 0) {
        const { error: spaceError } = await supabase
          .from("scenario_spaces")
          .insert(
            formData.spaceIds.map(spaceId => ({
              scenario_id: scenario.id,
              space_id: spaceId
            }))
          );

        if (spaceError) throw spaceError;

        const financials = formData.financials
          .filter(f => formData.spaceIds.includes(f.spaceId))
          .map(f => ({
            scenario_id: scenario.id,
            space_id: f.spaceId,
            monthly_cost: f.monthlyCost,
            lease_term_months: f.leaseTermMonths,
            start_date: f.startDate
          }));

        if (financials.length > 0) {
          const { error: financialError } = await supabase
            .from("scenario_financials")
            .insert(financials);

          if (financialError) throw financialError;
        }
      }

      // Insert Attribute Ratings
      if (formData.attributeRatings.length > 0) {
        const { error: ratingError } = await supabase
          .from("scenario_attribute_ratings")
          .insert(
            formData.attributeRatings.map(rating => ({
              scenario_id: scenario.id,
              attribute_id: rating.attributeId,
              lob_id: rating.lobId,
              rating: rating.rating
            }))
          );

        if (ratingError) throw ratingError;
      }

      await queryClient.invalidateQueries({ queryKey: ["scenarios"] });
      
      toast({
        title: "Success",
        description: "Scenario created successfully"
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating scenario:", error);
      toast({
        title: "Error",
        description: "Failed to create scenario. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <WizardSteps steps={STEPS} currentStep={currentStep} />

        <div className="mb-8">{renderStep()}</div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
          >
            Back
          </Button>
          {currentStep === STEPS.length ? (
            <Button
              className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45]"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Scenario"}
            </Button>
          ) : (
            <Button
              className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45]"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
