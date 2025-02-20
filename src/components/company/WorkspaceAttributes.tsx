
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";
import { AttributeRow } from "./AttributeRow";
import { WorkspaceAttribute, PREDEFINED_ATTRIBUTES } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkspaceAttributesProps {
  attributes: WorkspaceAttribute[];
  isAdmin: boolean;
  newAttribute: string;
  onNewAttributeChange: (value: string) => void;
  onAddAttribute: () => void;
  onDeleteAttribute: (id: number) => void;
  onImportanceChange: (id: number, importance: number) => void;
}

export const WorkspaceAttributes = ({
  attributes,
  isAdmin,
  newAttribute,
  onNewAttributeChange,
  onAddAttribute,
  onDeleteAttribute,
  onImportanceChange,
}: WorkspaceAttributesProps) => {
  const usedAttributes = new Set(attributes.map(attr => attr.name));
  const primaryAttributes = attributes.filter((_, index) => index < 3);
  const secondaryAttributes = attributes.filter((_, index) => index >= 3);
  const isPrimaryFull = primaryAttributes.length >= 3;
  const isSecondaryFull = secondaryAttributes.length >= 3;

  const totalWeight = attributes.reduce((sum, attr) => sum + attr.importance, 0);
  const hasWeightingError = totalWeight !== 100 && attributes.length === 6;

  return (
    <Card className="border border-[#474a4f]/10 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b border-[#474a4f]/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-[1.5em] font-semibold text-[#474a4f]">
              Workspace Attributes (Company-Wide)
            </CardTitle>
            <InfoTooltip 
              content="Workspace Attributes let you define which aspects—like Collaboration, Wellness, Brand Image—are most important to your organization as a whole. Each line of business can later choose or refine these attributes."
            />
          </div>
          <p className="text-[#474a4f]/80 text-base">
            These are the master set of workplace attributes that define what your organization values in any office space. You can pick up to 6 total: 3 "main" (primary) and 3 "secondary" (secondary). All Lines of Business will reference this set, though each LOB can further refine which ones they adopt and how they weight them.
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-[#474a4f]">Available Attributes</h3>
              <InfoTooltip 
                content="From this list of 20 potential attributes, select 3 primary (top-priority) and 3 secondary. You may provide default weighting if desired. LOBs can then refine or skip attributes not relevant to them."
              />
            </div>
            {isAdmin && attributes.length < 6 && (
              <div className="flex items-center gap-3">
                <Select
                  value={newAttribute}
                  onValueChange={onNewAttributeChange}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select an attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 text-sm text-[#474a4f]/60">
                      {!isPrimaryFull ? 'Select a primary attribute' : 'Select a secondary attribute'}
                    </div>
                    {PREDEFINED_ATTRIBUTES
                      .filter(attr => !usedAttributes.has(attr))
                      .map((attr) => (
                        <SelectItem 
                          key={attr} 
                          value={attr}
                          className="relative group"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{attr}</span>
                            <InfoTooltip
                              content={getAttributeDescription(attr)}
                            />
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={onAddAttribute}
                  disabled={!newAttribute || (isPrimaryFull && isSecondaryFull)}
                  className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] font-semibold disabled:opacity-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {!isPrimaryFull ? 'Primary' : 'Secondary'} Attribute
                </Button>
              </div>
            )}
          </div>

          {attributes.length === 0 ? (
            <div className="text-center py-8 bg-[#f8f8f8] rounded-lg">
              <p className="text-[#9e9e9e]">
                No workspace attributes defined yet
              </p>
              <p className="text-[#474a4f]/60 text-sm mt-1">
                Add up to 6 attributes that define what your organization values
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[#474a4f]">Primary Attributes</h4>
                    <InfoTooltip 
                      content="These are your top 3 most important workspace attributes. They should reflect your organization's highest priorities."
                    />
                    {isPrimaryFull && (
                      <span className="text-sm text-[#22c55e]">(Complete)</span>
                    )}
                  </div>
                  {primaryAttributes.map((attribute) => (
                    <AttributeRow
                      key={attribute.id}
                      attribute={attribute}
                      isAdmin={isAdmin}
                      onDelete={() => onDeleteAttribute(attribute.id)}
                      onImportanceChange={(importance) =>
                        onImportanceChange(attribute.id, importance)
                      }
                    />
                  ))}
                  {!isPrimaryFull && (
                    <div className="text-sm text-[#474a4f]/60 italic">
                      {3 - primaryAttributes.length} primary attribute{3 - primaryAttributes.length !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[#474a4f]">Secondary Attributes</h4>
                    <InfoTooltip 
                      content="These supporting attributes complement your primary ones and provide additional context for workspace evaluation."
                    />
                    {isSecondaryFull && (
                      <span className="text-sm text-[#22c55e]">(Complete)</span>
                    )}
                  </div>
                  {secondaryAttributes.map((attribute) => (
                    <AttributeRow
                      key={attribute.id}
                      attribute={attribute}
                      isAdmin={isAdmin}
                      onDelete={() => onDeleteAttribute(attribute.id)}
                      onImportanceChange={(importance) =>
                        onImportanceChange(attribute.id, importance)
                      }
                    />
                  ))}
                  {!isSecondaryFull && (
                    <div className="text-sm text-[#474a4f]/60 italic">
                      {3 - secondaryAttributes.length} secondary attribute{3 - secondaryAttributes.length !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
              </div>

              {attributes.length === 6 && (
                <div className={`flex items-center gap-2 text-sm p-3 rounded-lg mt-4 ${
                  hasWeightingError ? 'bg-[#ef5823]/5 text-[#ef5823]' : 'bg-[#22c55e]/5 text-[#22c55e]'
                }`}>
                  <AlertCircle className="h-4 w-4" />
                  {hasWeightingError 
                    ? `Total weighting must equal 100% (currently ${totalWeight}%)`
                    : 'All attributes selected and properly weighted'}
                </div>
              )}

              {isAdmin && (
                <div className="mt-4 p-3 bg-[#f8f8f8] rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#474a4f]/60" />
                    <p className="text-sm text-[#474a4f]/80">
                      Changing these attributes may affect existing Lines of Business and Scenarios
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

// Helper function to get attribute descriptions
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
