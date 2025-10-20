import { useQuery } from '@tanstack/react-query';
import { getAgreementDocumentAuditLogByAgreementId } from '@/services/agreement-document-audit.service';

/**
 * Hook React Query para buscar logs de auditoria de documentos de convênio
 * @param agreementId - ID do convênio para buscar logs de documentos
 * @returns Query com dados de auditoria de documentos
 */
export function useAgreementDocumentAuditLog(agreementId: number | null) {
  return useQuery({
    queryKey: ['agreementDocumentAuditLog', agreementId],
    queryFn: () => agreementId ? getAgreementDocumentAuditLogByAgreementId(agreementId) : Promise.resolve([]),
    enabled: !!agreementId,
  });
}
