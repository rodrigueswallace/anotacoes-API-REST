import { useQuery } from '@tanstack/react-query';
import { getAssetGroupAuditLog } from '@/services/asset-group-audit.service';

export function useAssetGroupAuditLog(assetGroupId: number | null) {
  return useQuery({
    queryKey: ['assetGroupAuditLog', assetGroupId],
    queryFn: () => assetGroupId ? getAssetGroupAuditLog(assetGroupId) : Promise.resolve([]),
    enabled: !!assetGroupId,
  });
}
