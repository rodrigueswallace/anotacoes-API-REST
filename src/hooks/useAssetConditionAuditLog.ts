import { useQuery } from '@tanstack/react-query';
import { getAssetConditionAuditLog } from '@/services/asset-condition-audit.service';

export function useAssetConditionAuditLog(assetConditionId: number | null) {
  return useQuery({
    queryKey: ['assetConditionAuditLog', assetConditionId],
    queryFn: () => assetConditionId ? getAssetConditionAuditLog(assetConditionId) : Promise.resolve([]),
    enabled: !!assetConditionId,
  });
}
