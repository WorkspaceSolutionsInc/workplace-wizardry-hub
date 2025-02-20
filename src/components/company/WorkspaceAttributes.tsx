
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, HelpCircle } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";
import { AttributeRow } from "./AttributeRow";
import { WorkspaceAttribute, PREDEFINED_ATTRIBUTES, ATTRIBUTE_DESCRIPTIONS } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface WorkspaceAttributesProps {
  attributes: WorkspaceAttribute[];
  isAdmin: boolean;
  onAddAttribute: (name: string, isPrimary: boolean) => void;
  onDeleteAttribute: (id: number) => void;
  onImportanceChange: (id: number, importance: number) => void;
  onTogglePrimary: (id: number) => void;
}

export const WorkspaceAttributes = ({
  attributes,
  isAdmin,
  onAddAttribute,
  onDeleteAttribute,
  onImportanceChange,
  onTogglePrimary,
}: WorkspaceAttributesProps) => {
  const { toast } = useToast();
  const primaryAttributes = attributes.filter(attr => attr.is_primary);
  const secondaryAttributes = attributes.filter(attr => !attr.is_primary);
  const usedAttributes = new Set(attributes.map(attr => attr.name));
  
  const handleAddAttribute = (name: string, isPrimary: boolean) => {
    if (isPrimary && primaryAttributes.length >= 3) {
      toast({
        title: "Error",
        description: "You can only have up to 3 main attributes",
        variant: "destructive",
      });
      return;
    }
    if (!isPrimary && secondaryAttributes.length >= 3) {
      toast({
        title: "Error",
        description: "You can only have up to 3 secondary attributes",
        variant: "destructive",
      });
      return;
    }
    onAddAttribute(name, isPrimary);
  };

  const totalWeight = attributes.reduce((sum, attr) => sum + attr.importance, 0);
  const hasWeightingError = totalWeight !== 100 && attributes.length === 6;

  return (
    <Card className="border border-[#474a4f]/10 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b border-[#474a4f]/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-[1.5em] font-semibold text-[#474a4f]">
              Workspace Attributes
            </CardTitle>
            <InfoTooltip content="Select 3 main and 3 secondary attributes that define what your organization values in workspace design" />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#474a4f]/80">
            <HelpCircle className="h-4 w-4" />
            <p>Need help? Hover over each attribute for a definition.</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Selection Panel */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-[#f8f8f8] rounded-lg">
            {PREDEFINED_ATTRIBUTES.map((attr) => (
              <div 
                key={attr}
                className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#474a4f]">{attr}</span>
                  <InfoTooltip content={ATTRIBUTE_DESCRIPTIONS[attr]} />
                </div>
                {!usedAttributes.has(attr) && isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAttribute(attr, true)}
                      className="text-xs"
                      disabled={primaryAttributes.length >= 3}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add as Main
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAttribute(attr, false)}
                      className="text-xs"
                      disabled={secondaryAttributes.length >= 3}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add as Secondary
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Attributes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-[#474a4f]">Main Attributes</h4>
                <span className="text-sm text-[#474a4f]/60">
                  ({primaryAttributes.length}/3)
                </span>
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
                  onTogglePrimary={() => onTogglePrimary(attribute.id)}
                />
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-[#474a4f]">Secondary Attributes</h4>
                <span className="text-sm text-[#474a4f]/60">
                  ({secondaryAttributes.length}/3)
                </span>
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
                  onTogglePrimary={() => onTogglePrimary(attribute.id)}
                />
              ))}
            </div>
          </div>

          {/* Weighting Validation */}
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
                  Assign weights to reflect the relative importance of each attribute. Lines of Business can override these defaults if needed.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
