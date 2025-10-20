import { useQuery } from '@tanstack/react-query';
import { getCredentialingEntityAuditLog } from '@/services/credentialing-entity-audit.service';

export const useCredentialingEntityAuditLog = (entityId: number | null) => {
  return useQuery({
    queryKey: ['credentialing-entity-audit-log', entityId],
    queryFn: () => entityId ? getCredentialingEntityAuditLog(entityId) : Promise.resolve([]),
    enabled: !!entityId,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
