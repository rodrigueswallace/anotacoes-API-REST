import { useQuery } from '@tanstack/react-query';
import { getAgencyAuditLog } from '@/services/agency-audit.service';

export function useAgencyAuditLog(agencyId: number | null) {
  return useQuery({
    queryKey: ['agencyAuditLog', agencyId],
    queryFn: () => agencyId ? getAgencyAuditLog(agencyId) : Promise.resolve([]),
    enabled: !!agencyId,
  });
}
