import { useQuery } from '@tanstack/react-query';
import { getAllExternalPartyAuditLogs } from '@/services/external-party-audit.service';

/**
 * Hook para buscar o histórico de auditoria completo de um fornecedor/terceiro
 * Inclui logs da entidade principal e de endereços
 */
export function useExternalPartyAuditLog(externalPartyId: number | null) {
  return useQuery({
    queryKey: ['externalPartyAuditLog', externalPartyId],
    queryFn: () => externalPartyId ? getAllExternalPartyAuditLogs(externalPartyId) : Promise.resolve([]),
    enabled: !!externalPartyId,
  });
}
