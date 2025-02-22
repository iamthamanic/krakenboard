
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Integration = {
  id: string;
  type: string;
  is_active: boolean;
  last_sync_at: string | null;
  metadata: Record<string, any>;
};

export const useIntegrations = () => {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integrations")
        .select("*");

      if (error) throw error;
      return data as Integration[];
    }
  });
};
