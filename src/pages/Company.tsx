import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, GripVertical, Plus, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Industry = 
  | "Technology"
  | "Finance"
  | "Healthcare"
  | "Retail"
  | "Manufacturing"
  | "Professional Services"
  | "Education"
  | "Government"
  | "Other";

interface CompanyProfile {
  id: number;
  name: string;
  industry: Industry;
  company_size: number;
  number_of_sites: number;
}

interface WorkspaceAttribute {
  id: number;
  name: string;
  importance: number;
  order_index: number;
}

interface CompanyGoal {
  id: number;
  name: string;
  company_id: number;
}

interface IndustryWeighting {
  id: number;
  attribute_name: string;
  default_weight: number;
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
      return data as CompanyGoal[];
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
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("company_goals")
        .insert([
          {
            name,
            company_id: profile?.id,
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

  const updateImportance = useMutation({
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
    <div className="animate-fadeIn space-y-8">
      <div className="bg-[#fccc55] p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[2em] font-bold text-[#474a4f] tracking-tight">
              Company Profile
            </h1>
            <p className="text-[#474a4f]/80 mt-1 text-base">
              Manage your global settings and workspace criteria
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

      <Card className="border border-[#474a4f]/10 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b border-[#474a4f]/10">
          <CardTitle className="text-[1.5em] font-semibold text-[#474a4f]">
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {isAdmin && isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editedProfile) {
                  updateProfile.mutate(editedProfile);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#474a4f]">Company Name</label>
                <Input
                  value={editedProfile?.name ?? ""}
                  onChange={(e) =>
                    setEditedProfile((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#474a4f]">Industry</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={editedProfile?.industry ?? ""}
                  onChange={(e) => {
                    setEditedProfile((prev) =>
                      prev ? { ...prev, industry: e.target.value as Industry } : null
                    );
                  }}
                  required
                >
                  <option value="">Select an industry</option>
                  {[
                    "Technology",
                    "Finance",
                    "Healthcare",
                    "Retail",
                    "Manufacturing",
                    "Professional Services",
                    "Education",
                    "Government",
                    "Other",
                  ].map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#474a4f]">Company Size</label>
                <Input
                  type="number"
                  value={editedProfile?.company_size ?? ""}
                  onChange={(e) =>
                    setEditedProfile((prev) =>
                      prev
                        ? { ...prev, company_size: parseInt(e.target.value) }
                        : null
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#474a4f]">Number of Sites</label>
                <Input
                  type="number"
                  value={editedProfile?.number_of_sites ?? ""}
                  onChange={(e) =>
                    setEditedProfile((prev) =>
                      prev
                        ? { ...prev, number_of_sites: parseInt(e.target.value) }
                        : null
                    )
                  }
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit"
                  className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] font-semibold"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(null);
                  }}
                  className="border-[#474a4f]/20 text-[#474a4f] hover:bg-[#474a4f]/5"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-[#9e9e9e] mb-1">
                  Company Name
                </p>
                <p className="text-lg text-[#474a4f]">{profile?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#9e9e9e] mb-1">
                  Industry
                </p>
                <p className="text-lg text-[#474a4f]">{profile?.industry}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#9e9e9e] mb-1">
                  Company Size
                </p>
                <p className="text-lg text-[#474a4f]">
                  {profile?.company_size.toLocaleString()} employees
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#9e9e9e] mb-1">
                  Number of Sites
                </p>
                <p className="text-lg text-[#474a4f]">
                  {profile?.number_of_sites.toLocaleString()} locations
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-[#474a4f]/10 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b border-[#474a4f]/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[1.5em] font-semibold text-[#474a4f]">
              Company Goals
            </CardTitle>
            {isAdmin && goals.length < 10 && (
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Add a new company goal"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-[300px] border-[#474a4f]/20 focus-visible:ring-[#fccc55]"
                />
                <Button
                  onClick={() => {
                    if (newGoal.trim()) {
                      addGoal.mutate(newGoal.trim());
                    }
                  }}
                  className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {goals.length === 0 ? (
              <p className="text-[#9e9e9e] text-center py-4">
                No company goals defined yet
              </p>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg group hover:bg-[#f3f3f3] transition-colors"
                >
                  <span className="text-[#474a4f] font-medium">{goal.name}</span>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to remove this goal?")) {
                          // TODO: Implement delete goal
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[#ef5823] hover:text-[#ef5823] hover:bg-[#ef5823]/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#474a4f]/10 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b border-[#474a4f]/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[1.5em] font-semibold text-[#474a4f]">
              Workspace Attributes
            </CardTitle>
            {isAdmin && attributes.length < 10 && (
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Add a new workspace attribute"
                  value={newAttribute}
                  onChange={(e) => setNewAttribute(e.target.value)}
                  className="w-[300px] border-[#474a4f]/20 focus-visible:ring-[#fccc55]"
                />
                <Button
                  onClick={() => {
                    if (newAttribute.trim()) {
                      addAttribute.mutate(newAttribute.trim());
                    }
                  }}
                  className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attribute
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {attributes.length === 0 ? (
              <p className="text-[#9e9e9e] text-center py-4">
                No workspace attributes defined yet
              </p>
            ) : (
              attributes.map((attribute) => (
                <div
                  key={attribute.id}
                  className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg group hover:bg-[#f3f3f3] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <GripVertical className="h-5 w-5 text-[#9e9e9e] cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    <span className="text-[#474a4f] font-medium">
                      {attribute.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={attribute.importance}
                        onChange={(e) =>
                          updateImportance.mutate({
                            id: attribute.id,
                            importance: parseInt(e.target.value),
                          })
                        }
                        className="w-[80px] border-[#474a4f]/20 focus-visible:ring-[#fccc55]"
                        disabled={!isAdmin}
                      />
                      <span className="text-sm text-[#9e9e9e]">%</span>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAttribute.mutate(attribute.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#ef5823] hover:text-[#ef5823] hover:bg-[#ef5823]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            {attributes.length >= 10 && (
              <div className="flex items-center gap-2 text-sm text-[#ef5823] bg-[#ef5823]/5 p-3 rounded-lg mt-4">
                <AlertCircle className="h-4 w-4" />
                Maximum number of attributes (10) reached
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Company;
