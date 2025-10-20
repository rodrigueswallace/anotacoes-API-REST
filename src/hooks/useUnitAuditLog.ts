import { useQuery } from "@tanstack/react-query";
import { getUnitAuditLog } from "@/services/unit-audit.service";

export const useUnitAuditLog = (unitId: number | null) => {
  return useQuery({
    queryKey: ["unit-audit-log", unitId],
    queryFn: () => unitId ? getUnitAuditLog(unitId) : Promise.resolve([]),
    enabled: !!unitId,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
