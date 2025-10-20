import { useQuery } from '@tanstack/react-query';
import { getLawAuditLog } from '@/services/law-audit.service';

export function useLawAuditLog(lawId: number | null) {
  return useQuery({
    queryKey: ['lawAuditLog', lawId],
    queryFn: () => lawId ? getLawAuditLog(lawId) : Promise.resolve([]),
    enabled: !!lawId,
  });
}
