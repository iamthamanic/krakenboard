
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FunctionItem {
  name: string;
  implemented: boolean;
  description: string;
}

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
    website?: (string | FunctionItem)[];
    social?: (string | FunctionItem)[];
    ads?: (string | FunctionItem)[];
    automation?: (string | FunctionItem)[];
    infrastructure?: string[];
    pipeline?: string[];
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
