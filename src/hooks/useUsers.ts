
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  const createUser = useMutation({
    mutationFn: async (profile: Omit<UserProfile, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("profiles")
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  return {
    users,
    updateUser,
    createUser
  };
};
