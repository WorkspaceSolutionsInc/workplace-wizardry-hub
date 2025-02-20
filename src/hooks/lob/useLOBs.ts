
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LineOfBusiness } from "@/components/lob/types";

export function useLOBs() {
  return useQuery({
    queryKey: ["lobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lines_of_business")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as LineOfBusiness[];
    }
  });
}
