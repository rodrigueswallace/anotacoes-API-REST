import { useQuery } from '@tanstack/react-query';
import { getLawDocumentAuditLogByLawId } from '@/services/law-document-audit.service';

export function useLawDocumentAuditLog(lawId: number | null) {
  return useQuery({
    queryKey: ['lawDocumentAuditLog', lawId],
    queryFn: () => lawId ? getLawDocumentAuditLogByLawId(lawId) : Promise.resolve([]),
    enabled: !!lawId,
  });
}
