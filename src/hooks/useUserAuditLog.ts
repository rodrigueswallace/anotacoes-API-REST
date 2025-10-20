import { useQuery } from "@tanstack/react-query";
import { getUserAuditLog } from "@/services/user-audit.service";

export const useUserAuditLog = (userId: string | null) => {
  return useQuery({
    queryKey: ["user-audit-log", userId],
    queryFn: () => getUserAuditLog(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
