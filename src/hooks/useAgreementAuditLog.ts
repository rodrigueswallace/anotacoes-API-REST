import { useQuery } from '@tanstack/react-query';
import { getAgreementAuditLog } from '@/services/agreement-audit.service';

export function useAgreementAuditLog(agreementId: number | null) {
  return useQuery({
    queryKey: ['agreementAuditLog', agreementId],
    queryFn: () => agreementId ? getAgreementAuditLog(agreementId) : Promise.resolve([]),
    enabled: !!agreementId,
  });
}
