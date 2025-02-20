
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2 } from "lucide-react";
import { WorkspaceAttribute } from "./types";
import { InfoTooltip } from "./InfoTooltip";

interface AttributeRowProps {
  attribute: WorkspaceAttribute;
  isAdmin: boolean;
  onDelete: () => void;
  onImportanceChange: (importance: number) => void;
}

export const AttributeRow = ({
  attribute,
  isAdmin,
  onDelete,
  onImportanceChange,
}: AttributeRowProps) => {
  const getAttributeDescription = (attr: string): string => {
    const descriptions: Record<string, string> = {
      "Collaboration": "Spaces that encourage team interaction, huddle rooms, open layout",
      "Cost Efficiency": "Optimal use of space and resources to minimize operational costs",
      "Employee Wellness": "Features promoting physical and mental health, including air quality and comfort",
      "Location Convenience": "Accessibility for employees, clients, and business needs",
      "Brand Image / Aesthetics": "Visual appeal and alignment with company brand identity",
      "Quiet Spaces / Focus Areas": "Dedicated areas for concentrated work and privacy",
      "Technology Infrastructure": "IT systems, connectivity, and digital workspace capabilities",
      "Flexibility / Agile Spaces": "Adaptable spaces that can be reconfigured for different needs",
      "Sustainability / Green Initiatives": "Environmental impact and energy efficiency measures",
      "Security / Access Control": "Physical security measures and access management",
      "Amenities (Cafeteria, Gym)": "On-site facilities for employee convenience and satisfaction",
      "Parking / Transportation": "Access to parking and public transit options",
      "Team Adjacencies": "Strategic placement of teams for optimal collaboration",
      "Openness / Layout Flow": "Space planning that promotes movement and interaction",
      "Daylight / Natural Lighting": "Access to natural light and views",
      "Safety (Fire, Earthquake readiness)": "Emergency preparedness and safety features",
      "Workspace Density": "Appropriate space allocation per person, avoiding overcrowding",
      "Privacy / Soundproofing": "Acoustic isolation and visual privacy measures",
      "Executive / Client Impressiveness": "Areas designed to impress visitors and clients",
      "Furniture Ergonomics": "Comfortable, adjustable furniture supporting employee health"
    };
    
    return descriptions[attr] || attr;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg group hover:bg-[#f3f3f3] transition-colors">
      <div className="flex items-center gap-3">
        {isAdmin && (
          <GripVertical className="h-5 w-5 text-[#9e9e9e] cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="flex items-center gap-2">
          <span className="text-[#474a4f] font-medium">{attribute.name}</span>
          <InfoTooltip content={getAttributeDescription(attribute.name)} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max="100"
            value={attribute.importance}
            onChange={(e) => onImportanceChange(parseInt(e.target.value) || 0)}
            className="w-[80px] border-[#474a4f]/20 focus-visible:ring-[#fccc55]"
            disabled={!isAdmin}
          />
          <span className="text-sm text-[#9e9e9e]">%</span>
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-[#ef5823] hover:text-[#ef5823] hover:bg-[#ef5823]/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
