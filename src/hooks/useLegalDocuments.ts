
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LegalDocument {
  type: 'privacy' | 'terms';
  content: string;
  updated_at: string;
}

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
      return data as LegalDocument;
    }
  });

  const updateDocument = async (content: string) => {
    const { error } = await supabase
      .from("legal_documents")
      .upsert({ 
        type, 
        content,
        updated_at: new Date().toISOString() 
      });

    if (error) {
      toast.error("Fehler beim Speichern");
      throw error;
    }

    toast.success("Erfolgreich gespeichert");
  };

  return { document, isLoading, updateDocument };
};
