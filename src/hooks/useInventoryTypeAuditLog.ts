import { useQuery } from '@tanstack/react-query';
import { getInventoryTypeAuditLog } from '@/services/inventory-type-audit.service';

export function useInventoryTypeAuditLog(inventoryTypeId: number | null) {
  return useQuery({
    queryKey: ['inventoryTypeAuditLog', inventoryTypeId],
    queryFn: () => inventoryTypeId ? getInventoryTypeAuditLog(inventoryTypeId) : Promise.resolve([]),
    enabled: !!inventoryTypeId,
  });
}
