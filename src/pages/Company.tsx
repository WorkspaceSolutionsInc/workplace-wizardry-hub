
import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyInformation } from "@/components/company/CompanyInformation";
import { WorkspaceAttributes } from "@/components/company/WorkspaceAttributes";
import { CompanyGoals } from "@/components/company/CompanyGoals";
import { useCompanyProfile } from "@/hooks/company/useCompanyProfile";
import { useWorkspaceAttributes } from "@/hooks/company/useWorkspaceAttributes";
import { useCompanyGoals } from "@/hooks/company/useCompanyGoals";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CompanyProfile } from "@/components/company/types";

const Company = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CompanyProfile | null>(null);
  const [isAdmin] = useState(true);
  const [newGoal, setNewGoal] = useState('');

  const { profile, isLoading: isLoadingProfile, updateProfile } = useCompanyProfile();
  const { 
    attributes, 
    isLoading: isLoadingAttributes,
    addAttribute,
    deleteAttribute,
    updateAttributeImportance,
    toggleAttributePrimary
  } = useWorkspaceAttributes(editedProfile?.industry);

  const {
    goals,
    isLoading: isLoadingGoals,
    addGoal,
    deleteGoal,
    updateGoalImportance,
    toggleGoalPrimary
  } = useCompanyGoals();

  if (isLoadingProfile || isLoadingAttributes || isLoadingGoals) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-[#474a4f] text-lg">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-[2em] font-bold text-[#474a4f]">
          Initialize Company Profile
        </h2>
        <p className="text-[#474a4f]/80 text-lg mb-4">
          Set up your company information to get started
        </p>
        <Button
          onClick={() => {
            setIsEditing(true);
            setEditedProfile({
              id: 1,
              name: "",
              industry: "Technology",
              company_size: 0,
              number_of_sites: 0,
            });
          }}
          className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] font-semibold text-base px-6"
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="animate-fadeIn space-y-8 pb-8">
        <div className="bg-[#fccc55] p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[2em] font-bold text-[#474a4f] tracking-tight">
                Company Profile
              </h1>
              <p className="text-[#474a4f]/80 mt-1 text-base">
                Configure your organization's profile, goals, and workspace preferences
              </p>
            </div>
            {isAdmin && !isEditing && (
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setEditedProfile(profile);
                }}
                className="bg-[#474a4f] text-white hover:bg-[#3e4449] font-semibold flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <CompanyInformation
          profile={profile}
          isAdmin={isAdmin}
          isEditing={isEditing}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
          onSave={(updatedProfile) => {
            updateProfile.mutate(updatedProfile);
            setIsEditing(false);
            setEditedProfile(null);
          }}
          onCancel={() => {
            setIsEditing(false);
            setEditedProfile(null);
          }}
        />

        <CompanyGoals
          goals={goals}
          isAdmin={isAdmin}
          newGoal={newGoal}
          onNewGoalChange={setNewGoal}
          onAddGoal={(isPrimary) => 
            addGoal.mutate({ 
              name: newGoal, 
              isPrimary, 
              companyId: profile.id 
            }, {
              onSuccess: () => setNewGoal('')
            })
          }
          onDeleteGoal={(id) => deleteGoal.mutate(id)}
          onImportanceChange={(id, importance) =>
            updateGoalImportance.mutate({ id, importance })
          }
          onTogglePrimary={(id) => toggleGoalPrimary.mutate(id)}
        />

        <WorkspaceAttributes
          attributes={attributes}
          isAdmin={isAdmin}
          onAddAttribute={(name) => addAttribute.mutate(name)}
          onDeleteAttribute={(id) => deleteAttribute.mutate(id)}
          onImportanceChange={(id, importance) =>
            updateAttributeImportance.mutate({ id, importance })
          }
          onTogglePrimary={(id) => toggleAttributePrimary.mutate(id)}
        />
      </div>
    </TooltipProvider>
  );
};

export default Company;
