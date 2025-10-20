import { useQuery } from '@tanstack/react-query';
import { getAcquisitionMethodRequiredDocumentAuditLogByMethodId } from '@/services/acquisition-method-required-documents-audit.service';

export function useAcquisitionMethodRequiredDocumentAuditLog(acquisitionMethodId: number | null) {
  return useQuery({
    queryKey: ['acquisitionMethodRequiredDocumentAuditLog', acquisitionMethodId],
    queryFn: () => acquisitionMethodId ? getAcquisitionMethodRequiredDocumentAuditLogByMethodId(acquisitionMethodId) : Promise.resolve([]),
    enabled: !!acquisitionMethodId,
  });
}
