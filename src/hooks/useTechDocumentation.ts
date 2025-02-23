
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

export const TECH_DOCUMENTATION_KEY = "tech-documentation";

export const useTechDocumentation = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [TECH_DOCUMENTATION_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tech_documentation")
        .select("*")
        .order("category");

      if (error) throw error;
      return data as TechDocumentation[];
    },
    staleTime: 1000 * 60 * 5, // Cache für 5 Minuten
    refetchOnWindowFocus: true, // Aktualisiere wenn Fenster fokussiert wird
  });
};

// Hilfsfunktion zum manuellen Invalidieren des Caches
export const invalidateTechDocumentation = async (queryClient: any) => {
  await queryClient.invalidateQueries({ queryKey: [TECH_DOCUMENTATION_KEY] });
};
