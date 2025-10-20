import { useQuery } from '@tanstack/react-query';
import { getAssetSubgroupAuditLog } from '@/services/asset-subgroup-audit.service';

export function useAssetSubgroupAuditLog(assetSubgroupId: number | null) {
  return useQuery({
    queryKey: ['assetSubgroupAuditLog', assetSubgroupId],
    queryFn: () => assetSubgroupId ? getAssetSubgroupAuditLog(assetSubgroupId) : Promise.resolve([]),
    enabled: !!assetSubgroupId,
  });
}
