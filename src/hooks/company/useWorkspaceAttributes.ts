
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceAttribute, IndustryWeighting, Industry } from "@/components/company/types";
import { useToast } from "@/components/ui/use-toast";

interface RawWorkspaceAttribute {
  id: number;
  name: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  importance: number;
  order_index: number;
  is_primary?: boolean;
}

export function useWorkspaceAttributes(industry?: Industry) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: attributes = [], isLoading } = useQuery({
    queryKey: ["workspaceAttributes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_attributes")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      
      return (data as RawWorkspaceAttribute[]).map(attr => ({
        ...attr,
        is_primary: attr.is_primary ?? false
      })) as WorkspaceAttribute[];
    },
  });

  const { data: industryWeightings = [] } = useQuery({
    queryKey: ["industryWeightings", industry],
    queryFn: async () => {
      if (!industry) throw new Error("Industry is required");
      
      const { data, error } = await supabase
        .from("industry_attribute_weightings")
        .select("*")
        .eq("industry", industry);
      
      if (error) throw error;
      return data as IndustryWeighting[];
    },
    enabled: !!industry,
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
            company_id: attributes[0]?.company_id,
            order_index: attributes.length
          },
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceAttributes"] });
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

  const toggleAttributePrimary = useMutation({
    mutationFn: async (id: number) => {
      const attribute = attributes.find(a => a.id === id);
      if (!attribute) return;

      const newIsPrimary = !attribute.is_primary;
      const primaryCount = attributes.filter(a => a.is_primary).length;

      if (newIsPrimary && primaryCount >= 3) {
        throw new Error("Maximum of 3 primary attributes allowed");
      }

      const { error } = await supabase
        .from("workspace_attributes")
        .update({ is_primary: newIsPrimary })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceAttributes"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update attribute priority",
        variant: "destructive",
      });
    },
  });

  return {
    attributes,
    isLoading,
    industryWeightings,
    addAttribute,
    deleteAttribute,
    updateAttributeImportance,
    toggleAttributePrimary,
  };
}
