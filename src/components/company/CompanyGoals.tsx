
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";
import { CompanyGoal, PREDEFINED_GOALS } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GoalRow } from "./GoalRow";

interface CompanyGoalsProps {
  goals: CompanyGoal[];
  isAdmin: boolean;
  newGoal: string;
  onNewGoalChange: (value: string) => void;
  onAddGoal: (isPrimary: boolean) => void;
  onDeleteGoal: (id: number) => void;
  onImportanceChange: (id: number, importance: number) => void;
  onTogglePrimary: (id: number) => void;
}

export const CompanyGoals = ({
  goals,
  isAdmin,
  newGoal,
  onNewGoalChange,
  onAddGoal,
  onDeleteGoal,
  onImportanceChange,
  onTogglePrimary,
}: CompanyGoalsProps) => {
  const usedGoals = new Set(goals.map(goal => goal.name));
  const primaryGoals = goals.filter(goal => goal.is_primary);
  const secondaryGoals = goals.filter(goal => !goal.is_primary);
  const isPrimaryFull = primaryGoals.length >= 3;
  const isSecondaryFull = secondaryGoals.length >= 3;

  const getGoalDescription = (goal: string): string => {
    const descriptions: Record<string, string> = {
      "Cost Optimization": "Strategies to reduce operational expenses and improve financial efficiency",
      "Workforce Retention": "Initiatives to maintain and develop valuable employees",
      "Brand Enhancement": "Efforts to strengthen market position and company image",
      "Innovation & Creativity": "Fostering new ideas and creative problem-solving",
      "Environmental Sustainability": "Reducing environmental impact and promoting green practices",
      "Employee Well-being": "Programs to improve employee health and satisfaction",
      "Operational Efficiency": "Streamlining processes and improving productivity",
      "Market Expansion": "Growing into new markets or customer segments",
      "Talent Attraction": "Recruiting top talent and maintaining competitive advantage",
      "Digital Transformation": "Adopting and leveraging new technologies"
    };
    return descriptions[goal] || goal;
  };

  return (
    <Card className="border border-[#474a4f]/10 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b border-[#474a4f]/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-[1.5em] font-semibold text-[#474a4f]">
              Company Goals
            </CardTitle>
            <InfoTooltip 
              content="Define your organization's key business objectives. These goals will help align workspace decisions with your strategic priorities."
            />
          </div>
          <p className="text-[#474a4f]/80 text-base">
            Select up to 6 goals (3 primary + 3 secondary) that represent your company's key objectives. These goals will help guide workspace decisions and ensure alignment with your business strategy.
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-[#474a4f]">Available Goals</h3>
              <InfoTooltip 
                content="Choose your most important business objectives. Primary goals have higher strategic importance, while secondary goals provide additional context for decision-making."
              />
            </div>
            {isAdmin && goals.length < 6 && (
              <div className="flex items-center gap-3">
                <Select
                  value={newGoal}
                  onValueChange={onNewGoalChange}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 text-sm text-[#474a4f]/60">
                      {!isPrimaryFull ? 'Select a primary goal' : 'Select a secondary goal'}
                    </div>
                    {PREDEFINED_GOALS
                      .filter(goal => !usedGoals.has(goal))
                      .map((goal) => (
                        <SelectItem 
                          key={goal} 
                          value={goal}
                          className="relative group"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{goal}</span>
                            <InfoTooltip content={getGoalDescription(goal)} />
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  {!isPrimaryFull && (
                    <Button
                      onClick={() => onAddGoal(true)}
                      disabled={!newGoal}
                      className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] font-semibold disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Primary
                    </Button>
                  )}
                  {!isSecondaryFull && (
                    <Button
                      onClick={() => onAddGoal(false)}
                      disabled={!newGoal}
                      variant="outline"
                      className="border-[#474a4f]/20 text-[#474a4f] hover:bg-[#474a4f]/5"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Secondary
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-8 bg-[#f8f8f8] rounded-lg">
              <p className="text-[#9e9e9e]">
                No company goals defined yet
              </p>
              <p className="text-[#474a4f]/60 text-sm mt-1">
                Add up to 6 goals (3 primary + 3 secondary) to define your strategic objectives
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[#474a4f]">Primary Goals</h4>
                    <InfoTooltip 
                      content="These are your top 3 strategic priorities that directly influence workspace decisions."
                    />
                    {isPrimaryFull && (
                      <span className="text-sm text-[#22c55e]">(Complete)</span>
                    )}
                  </div>
                  {primaryGoals.map((goal) => (
                    <GoalRow
                      key={goal.id}
                      goal={goal}
                      isAdmin={isAdmin}
                      onDelete={() => onDeleteGoal(goal.id)}
                      onImportanceChange={(importance) =>
                        onImportanceChange(goal.id, importance)
                      }
                      onTogglePrimary={() => onTogglePrimary(goal.id)}
                    />
                  ))}
                  {!isPrimaryFull && (
                    <div className="text-sm text-[#474a4f]/60 italic">
                      {3 - primaryGoals.length} primary goal{3 - primaryGoals.length !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[#474a4f]">Secondary Goals</h4>
                    <InfoTooltip 
                      content="Supporting objectives that provide additional context for workspace planning."
                    />
                    {isSecondaryFull && (
                      <span className="text-sm text-[#22c55e]">(Complete)</span>
                    )}
                  </div>
                  {secondaryGoals.map((goal) => (
                    <GoalRow
                      key={goal.id}
                      goal={goal}
                      isAdmin={isAdmin}
                      onDelete={() => onDeleteGoal(goal.id)}
                      onImportanceChange={(importance) =>
                        onImportanceChange(goal.id, importance)
                      }
                      onTogglePrimary={() => onTogglePrimary(goal.id)}
                    />
                  ))}
                  {!isSecondaryFull && (
                    <div className="text-sm text-[#474a4f]/60 italic">
                      {3 - secondaryGoals.length} secondary goal{3 - secondaryGoals.length !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div className="mt-4 p-3 bg-[#f8f8f8] rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#474a4f]/60" />
                    <p className="text-sm text-[#474a4f]/80">
                      Company goals help align workspace decisions with your strategic objectives
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
