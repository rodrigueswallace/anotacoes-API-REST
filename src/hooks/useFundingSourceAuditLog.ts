import { useQuery } from '@tanstack/react-query';
import { getFundingSourceAuditLog } from '@/services/funding-source-audit.service';

export function useFundingSourceAuditLog(fundingSourceId: number | null) {
  return useQuery({
    queryKey: ['fundingSourceAuditLog', fundingSourceId],
    queryFn: () => fundingSourceId ? getFundingSourceAuditLog(fundingSourceId) : Promise.resolve([]),
    enabled: !!fundingSourceId,
  });
}
