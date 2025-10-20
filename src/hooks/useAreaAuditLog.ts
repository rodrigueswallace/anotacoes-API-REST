import { useQuery } from '@tanstack/react-query';
import { getAreaAuditLog } from '@/services/area-audit.service';

export function useAreaAuditLog(areaId: number | null) {
  return useQuery({
    queryKey: ['areaAuditLog', areaId],
    queryFn: () => areaId ? getAreaAuditLog(areaId) : Promise.resolve([]),
    enabled: !!areaId,
  });
}
