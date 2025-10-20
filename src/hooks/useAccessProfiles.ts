import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AccessProfile } from "@/types/user.types";

export const useAccessProfiles = () => {
  return useQuery({
    queryKey: ["accessProfiles"],
    queryFn: async (): Promise<AccessProfile[]> => {
      const { data, error } = await supabase
        .from("m_org_t_access_profile")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};
