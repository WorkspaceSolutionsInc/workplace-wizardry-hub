
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Space } from "@/components/spaces/types";

export function useSpaces() {
  return useQuery({
    queryKey: ["spaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Space[];
    }
  });
}
