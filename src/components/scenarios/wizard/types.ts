
export interface CreateScenarioFormData {
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

export interface WizardStepProps {
  formData: CreateScenarioFormData;
  onChange: (data: Partial<CreateScenarioFormData>) => void;
}

export type WizardStep = {
  id: number;
  title: string;
};
