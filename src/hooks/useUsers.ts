
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserProfile = {
  id: string;
  full_name: string;
  role: 'admin' | 'editor' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const useUsers = () => {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Fehler beim Laden der Benutzer");
        throw error;
      }

      return profiles as UserProfile[];
    }
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserProfile> & { id: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        toast.error("Fehler beim Aktualisieren des Benutzers");
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Benutzer erfolgreich aktualisiert");
    }
  });

  const createUser = useMutation({
    mutationFn: async (profile: Omit<UserProfile, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("profiles")
        .insert([profile])
        .select()
        .single();

      if (error) {
        toast.error("Fehler beim Erstellen des Benutzers");
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Benutzer erfolgreich erstellt");
    }
  });

  return {
    users,
    updateUser,
    createUser
  };
};
