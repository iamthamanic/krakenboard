
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TechDocumentation {
  id: string;
  category: string;
  title: string;
  content: {
    frontend?: string[];
    backend?: string[];
    tables?: string[];
    relations?: string[];
    implemented?: string[];
    integration?: string[];
  };
}

export const useTechDocumentation = () => {
  return useQuery({
    queryKey: ["tech-documentation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_documentation")
        .select("*")
        .order("category");

      if (error) throw error;
      return data as TechDocumentation[];
    },
  });
};
