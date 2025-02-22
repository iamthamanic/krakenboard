
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type LegalDocument = {
  id: string;
  type: 'privacy' | 'terms';
  content: string;
  created_at: string;
  updated_at: string;
};

export const useLegalDocument = (type: 'privacy' | 'terms') => {
  const queryClient = useQueryClient();

  const { data: document, isLoading } = useQuery({
    queryKey: ['legal-documents', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('type', type)
        .single();

      if (error) throw error;
      return data as LegalDocument;
    }
  });

  const { mutateAsync: updateDocument } = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('legal_documents')
        .update({ content })
        .eq('type', type);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-documents', type] });
      toast.success('Dokument wurde erfolgreich aktualisiert');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren des Dokuments');
      console.error('Update error:', error);
    }
  });

  return { document, isLoading, updateDocument };
};
