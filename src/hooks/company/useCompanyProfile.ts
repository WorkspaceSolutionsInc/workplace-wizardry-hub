
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyProfile } from "@/components/company/types";
import { useToast } from "@/components/ui/use-toast";

export function useCompanyProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
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

  return {
    profile,
    isLoading,
    updateProfile,
  };
}
