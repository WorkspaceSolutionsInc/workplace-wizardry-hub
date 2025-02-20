
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyGoal } from "@/components/company/types";
import { useToast } from "@/components/ui/use-toast";

interface RawCompanyGoal {
  id: number;
  name: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  importance?: number;
  is_primary?: boolean;
}

export function useCompanyGoals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
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

  const addGoal = useMutation({
    mutationFn: async ({ name, isPrimary, companyId }: { name: string; isPrimary: boolean; companyId?: number }) => {
      const { data, error } = await supabase
        .from("company_goals")
        .insert([
          {
            name,
            company_id: companyId,
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
      const primaryCount = goals.filter(g => g.is_primary).length;

      if (newIsPrimary && primaryCount >= 3) {
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
  });

  return {
    goals,
    isLoading,
    addGoal,
    deleteGoal,
    updateGoalImportance,
    toggleGoalPrimary,
  };
}
