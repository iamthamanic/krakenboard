
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLegalDocument = (type: 'privacy' | 'terms') => {
  const { data: document, isLoading } = useQuery({
    queryKey: ["legal-document", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_documents")
        .select("*")
        .eq("type", type)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const updateDocument = async (content: string) => {
    const { error } = await supabase
      .from("legal_documents")
      .upsert({ type, content });

    if (error) {
      toast.error("Fehler beim Speichern");
      throw error;
    }

    toast.success("Erfolgreich gespeichert");
  };

  return { document, isLoading, updateDocument };
};
