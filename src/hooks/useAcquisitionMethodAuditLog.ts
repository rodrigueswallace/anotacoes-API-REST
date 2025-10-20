import { useQuery } from '@tanstack/react-query';
import { getAcquisitionMethodAuditLog } from '@/services/acquisition-method-audit.service';

export function useAcquisitionMethodAuditLog(acquisitionMethodId: number | null) {
  return useQuery({
    queryKey: ['acquisitionMethodAuditLog', acquisitionMethodId],
    queryFn: () => acquisitionMethodId ? getAcquisitionMethodAuditLog(acquisitionMethodId) : Promise.resolve([]),
    enabled: !!acquisitionMethodId,
  });
}
