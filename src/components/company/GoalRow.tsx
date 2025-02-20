
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2, ArrowUpDown } from "lucide-react";
import { CompanyGoal, GOAL_DESCRIPTIONS } from "./types";
import { InfoTooltip } from "./InfoTooltip";

interface GoalRowProps {
  goal: CompanyGoal;
  isAdmin: boolean;
  onDelete: () => void;
  onImportanceChange: (importance: number) => void;
  onTogglePrimary: () => void;
}

export const GoalRow = ({
  goal,
  isAdmin,
  onDelete,
  onImportanceChange,
  onTogglePrimary,
}: GoalRowProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg group hover:bg-[#f3f3f3] transition-colors">
      <div className="flex items-center gap-3">
        {isAdmin && (
          <GripVertical className="h-5 w-5 text-[#9e9e9e] cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="flex items-center gap-2">
          <span className="text-[#474a4f] font-medium">{goal.name}</span>
          <InfoTooltip content={GOAL_DESCRIPTIONS[goal.name]} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max="100"
            value={goal.importance}
            onChange={(e) => onImportanceChange(parseInt(e.target.value) || 0)}
            className="w-[80px] border-[#474a4f]/20 focus-visible:ring-[#fccc55]"
            disabled={!isAdmin}
          />
          <span className="text-sm text-[#9e9e9e]">%</span>
        </div>
        {isAdmin && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePrimary}
              className="opacity-0 group-hover:opacity-100 text-[#474a4f] hover:text-[#474a4f] hover:bg-[#474a4f]/10"
              title={goal.is_primary ? "Move to Secondary" : "Move to Primary"}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 text-[#ef5823] hover:text-[#ef5823] hover:bg-[#ef5823]/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
