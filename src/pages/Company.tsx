
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
  const [isAdmin] = useState(true); // TODO: Replace with actual auth check

  // Fetch company profile
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

  // Fetch workspace attributes
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

  // Fetch company goals
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

  // Fetch industry weightings
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

  // Update company profile mutation
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

  // Add workspace attribute mutation
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

  // Delete workspace attribute mutation
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

  // Add company goal mutation
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

  // Update attribute importance mutation
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
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">Initialize Company Profile</h2>
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
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center justify-between bg-[#fccc55] p-4 rounded-lg">
        <div>
          <h1 className="text-4xl font-semibold text-[#474a4f]">
            Company Profile
          </h1>
          <p className="text-[#474a4f]/80 mt-1">
            Manage your global settings and workspace criteria
          </p>
        </div>
        {isAdmin && !isEditing && (
          <Button 
            onClick={() => {
              setIsEditing(true);
              setEditedProfile(profile);
            }}
            style={{ backgroundColor: "#474a4f" }}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Company Information Card */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

              <div className="flex gap-2">
                <Button 
                  type="submit"
                  style={{ backgroundColor: "#fccc55", color: "#474a4f" }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-[#9e9e9e]">
                    Company Name
                  </p>
                  <p className="text-lg text-[#474a4f]">{profile?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9e9e9e]">
                    Industry
                  </p>
                  <p className="text-lg text-[#474a4f]">{profile?.industry}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9e9e9e]">
                    Company Size
                  </p>
                  <p className="text-lg text-[#474a4f]">{profile?.company_size} employees</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9e9e9e]">
                    Number of Sites
                  </p>
                  <p className="text-lg text-[#474a4f]">{profile?.number_of_sites} locations</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Goals Card */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Company Goals</CardTitle>
            {isAdmin && goals.length < 10 && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New goal"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-[200px]"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (newGoal.trim()) {
                      addGoal.mutate(newGoal.trim());
                    }
                  }}
                  style={{ backgroundColor: "#fccc55", color: "#474a4f" }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg"
              >
                <span className="text-[#474a4f]">{goal.name}</span>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to remove this goal?")) {
                        // TODO: Implement delete goal
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workspace Attributes Card */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workspace Attributes</CardTitle>
            {isAdmin && attributes.length < 10 && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New attribute name"
                  value={newAttribute}
                  onChange={(e) => setNewAttribute(e.target.value)}
                  className="w-[200px]"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (newAttribute.trim()) {
                      addAttribute.mutate(newAttribute.trim());
                    }
                  }}
                  style={{ backgroundColor: "#fccc55", color: "#474a4f" }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attributes.length === 0 ? (
              <p className="text-[#9e9e9e] text-center py-4">
                No workspace attributes defined yet
              </p>
            ) : (
              <div className="space-y-2">
                {attributes.map((attribute) => (
                  <div
                    key={attribute.id}
                    className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg group hover:bg-secondary/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isAdmin && (
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      <span className="font-medium text-[#474a4f]">{attribute.name}</span>
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
                          className="w-[80px]"
                          disabled={!isAdmin}
                        />
                        <span className="text-sm text-[#9e9e9e]">%</span>
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteAttribute.mutate(attribute.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {attributes.length >= 10 && (
              <div className="flex items-center gap-2 text-sm text-[#9e9e9e] mt-4">
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
