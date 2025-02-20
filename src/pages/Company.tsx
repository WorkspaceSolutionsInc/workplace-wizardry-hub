import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CompanyInformation } from "@/components/company/CompanyInformation";
import { WorkspaceAttributes } from "@/components/company/WorkspaceAttributes";
import { CompanyGoals } from "@/components/company/CompanyGoals";
import {
  CompanyProfile,
  WorkspaceAttribute,
  CompanyGoal,
  IndustryWeighting,
} from "@/components/company/types";
import { TooltipProvider } from "@/components/ui/tooltip";

interface RawCompanyGoal {
  id: number;
  name: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  importance?: number;
  is_primary?: boolean;
}

const Company = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CompanyProfile | null>(null);
  const [newAttribute, setNewAttribute] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [isAdmin] = useState(true);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .single();
      
      if (error) throw error;
      return data as CompanyProfile;
    },
  });

  const { data: attributes = [], isLoading: isLoadingAttributes } = useQuery({
    queryKey: ["workspaceAttributes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_attributes")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      return data as WorkspaceAttribute[];
    },
  });

  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ["companyGoals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_goals")
        .select("*");
      
      if (error) throw error;
      
      return (data as RawCompanyGoal[] || []).map(goal => ({
        id: goal.id,
        name: goal.name,
        company_id: goal.company_id,
        importance: goal.importance ?? 0,
        is_primary: goal.is_primary ?? false
      })) as CompanyGoal[];
    },
  });

  const { data: industryWeightings = [] } = useQuery({
    queryKey: ["industryWeightings", editedProfile?.industry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industry_attribute_weightings")
        .select("*")
        .eq("industry", editedProfile?.industry);
      
      if (error) throw error;
      return data as IndustryWeighting[];
    },
    enabled: !!editedProfile?.industry,
  });

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<CompanyProfile>) => {
      if (!updatedProfile.industry) {
        throw new Error("Please select an industry");
      }

      const { data, error } = await supabase
        .from("company_profiles")
        .update(updatedProfile)
        .eq("id", profile?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
      toast({
        title: "Success",
        description: "Company profile updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update company profile",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    },
  });

  const addAttribute = useMutation({
    mutationFn: async (name: string) => {
      const industryWeighting = industryWeightings.find(w => w.attribute_name === name);
      
      const { data, error } = await supabase
        .from("workspace_attributes")
        .insert([
          {
            name,
            importance: industryWeighting?.default_weight || 0,
            company_id: profile?.id,
            order_index: attributes.length,
          },
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceAttributes"] });
      setNewAttribute("");
      toast({
        title: "Success",
        description: "Workspace attribute added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add workspace attribute. Maximum limit may have been reached.",
        variant: "destructive",
      });
      console.error("Error adding attribute:", error);
    },
  });

  const deleteAttribute = useMutation({
    mutationFn: async (id: number) => {
      const confirmed = window.confirm(
        "Warning: Removing this attribute might affect existing data in Lines of Business and Scenarios. Are you sure you want to proceed?"
      );
      
      if (!confirmed) {
        throw new Error("Operation cancelled by user");
      }

      const { error } = await supabase
        .from("workspace_attributes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceAttributes"] });
      toast({
        title: "Success",
        description: "Workspace attribute deleted successfully",
      });
    },
    onError: (error) => {
      if (error instanceof Error && error.message === "Operation cancelled by user") {
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to delete workspace attribute",
        variant: "destructive",
      });
      console.error("Error deleting attribute:", error);
    },
  });

  const addGoal = useMutation({
    mutationFn: async (isPrimary: boolean) => {
      if (!newGoal) return;

      const { data, error } = await supabase
        .from("company_goals")
        .insert([
          {
            name: newGoal,
            company_id: profile?.id,
            importance: 0,
            is_primary: isPrimary
          },
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyGoals"] });
      setNewGoal("");
      toast({
        title: "Success",
        description: "Company goal added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add company goal",
        variant: "destructive",
      });
      console.error("Error adding goal:", error);
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("company_goals")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyGoals"] });
      toast({
        title: "Success",
        description: "Company goal deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete company goal",
        variant: "destructive",
      });
      console.error("Error deleting goal:", error);
    },
  });

  const updateGoalImportance = useMutation({
    mutationFn: async ({ id, importance }: { id: number; importance: number }) => {
      const { error } = await supabase
        .from("company_goals")
        .update({ importance })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyGoals"] });
    },
  });

  const toggleGoalPrimary = useMutation({
    mutationFn: async (id: number) => {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      const newIsPrimary = !goal.is_primary;
      const primaryGoalsCount = goals.filter(g => g.is_primary).length;
      
      if (newIsPrimary && primaryGoalsCount >= 3) {
        throw new Error("Maximum of 3 primary goals allowed");
      }

      const { error } = await supabase
        .from("company_goals")
        .update({ is_primary: newIsPrimary })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyGoals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update goal priority",
        variant: "destructive",
      });
    },
  });

  const updateAttributeImportance = useMutation({
    mutationFn: async ({ id, importance }: { id: number; importance: number }) => {
      const { error } = await supabase
        .from("workspace_attributes")
        .update({ importance })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceAttributes"] });
    },
  });

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
          onSave={(updatedProfile) => updateProfile.mutate(updatedProfile)}
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
          onAddGoal={(isPrimary) => addGoal.mutate(isPrimary)}
          onDeleteGoal={(id) => deleteGoal.mutate(id)}
          onImportanceChange={(id, importance) =>
            updateGoalImportance.mutate({ id, importance })
          }
          onTogglePrimary={(id) => toggleGoalPrimary.mutate(id)}
        />

        <WorkspaceAttributes
          attributes={attributes}
          isAdmin={isAdmin}
          newAttribute={newAttribute}
          onNewAttributeChange={setNewAttribute}
          onAddAttribute={() => {
            if (newAttribute.trim()) {
              addAttribute.mutate(newAttribute.trim());
            }
          }}
          onDeleteAttribute={(id) => deleteAttribute.mutate(id)}
          onImportanceChange={(id, importance) =>
            updateAttributeImportance.mutate({ id, importance })
          }
        />
      </div>
    </TooltipProvider>
  );
};

export default Company;
