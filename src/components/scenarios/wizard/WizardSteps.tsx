
import { WizardStep } from "./types";

interface WizardStepsProps {
  steps: WizardStep[];
  currentStep: number;
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center ${
              step.id !== steps.length ? "flex-1" : ""
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
            {step.id !== steps.length && (
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
        {steps.map((step) => (
          <div key={step.id} className="text-center">
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}
